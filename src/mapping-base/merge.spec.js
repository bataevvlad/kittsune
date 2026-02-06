"use strict";
const { deepMerge, mergeMapping, createMapping } = require('./merge');

describe('@mapping-base: deepMerge', () => {
    it('should return base when override is null', () => {
        const base = { a: 1 };
        const result = deepMerge(base, null);
        expect(result).toEqual({ a: 1 });
    });

    it('should return base when override is undefined', () => {
        const base = { a: 1 };
        const result = deepMerge(base, undefined);
        expect(result).toEqual({ a: 1 });
    });

    it('should return override when base is null', () => {
        const override = { a: 1 };
        const result = deepMerge(null, override);
        expect(result).toEqual({ a: 1 });
    });

    it('should merge flat objects', () => {
        const base = { a: 1, b: 2 };
        const override = { b: 3, c: 4 };
        const result = deepMerge(base, override);
        expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should deep merge nested objects', () => {
        const base = {
            level1: {
                a: 1,
                level2: {
                    b: 2
                }
            }
        };
        const override = {
            level1: {
                level2: {
                    c: 3
                }
            }
        };
        const result = deepMerge(base, override);
        expect(result).toEqual({
            level1: {
                a: 1,
                level2: {
                    b: 2,
                    c: 3
                }
            }
        });
    });

    it('should replace arrays instead of merging', () => {
        const base = { arr: [1, 2, 3] };
        const override = { arr: [4, 5] };
        const result = deepMerge(base, override);
        expect(result).toEqual({ arr: [4, 5] });
    });

    it('should not mutate the original objects', () => {
        const base = { a: 1, nested: { b: 2 } };
        const override = { nested: { c: 3 } };

        deepMerge(base, override);

        expect(base).toEqual({ a: 1, nested: { b: 2 } });
        expect(override).toEqual({ nested: { c: 3 } });
    });

    it('should handle primitive override', () => {
        const base = { a: 1 };
        const override = 'string';
        const result = deepMerge(base, override);
        expect(result).toBe('string');
    });
});

describe('@mapping-base: mergeMapping', () => {
    it('should merge base mapping with overrides', () => {
        const baseMapping = {
            strict: { token1: 'value1' },
            components: {
                Button: { color: 'blue' }
            }
        };
        const overrides = {
            strict: { token2: 'value2' },
            components: {
                Button: { size: 'large' }
            }
        };

        const result = mergeMapping(baseMapping, overrides);

        expect(result).toEqual({
            strict: { token1: 'value1', token2: 'value2' },
            components: {
                Button: { color: 'blue', size: 'large' }
            }
        });
    });
});

describe('@mapping-base: createMapping', () => {
    const baseMapping = {
        version: 1.0,
        strict: {
            'text-font-family': 'System',
            'size-small': 32
        },
        components: {
            Button: {
                meta: { scope: 'all' },
                appearances: {
                    default: { mapping: { color: 'primary' } }
                }
            },
            Input: {
                meta: { scope: 'all' },
                appearances: {
                    default: { mapping: { borderWidth: 1 } }
                }
            }
        }
    };

    it('should return base when no overrides provided', () => {
        const result = createMapping({ base: baseMapping });
        expect(result).toEqual(baseMapping);
    });

    it('should merge strict token overrides', () => {
        const result = createMapping({
            base: baseMapping,
            strict: {
                'text-font-family': 'Roboto',
                'custom-token': 'value'
            }
        });

        expect(result.strict['text-font-family']).toBe('Roboto');
        expect(result.strict['custom-token']).toBe('value');
        expect(result.strict['size-small']).toBe(32);
    });

    it('should merge component overrides', () => {
        const result = createMapping({
            base: baseMapping,
            components: {
                Button: {
                    appearances: {
                        default: { mapping: { color: 'secondary' } }
                    }
                }
            }
        });

        expect(result.components.Button.appearances.default.mapping.color).toBe('secondary');
        // Input should remain unchanged
        expect(result.components.Input).toEqual(baseMapping.components.Input);
    });

    it('should handle both strict and component overrides', () => {
        const result = createMapping({
            base: baseMapping,
            strict: { 'new-token': 100 },
            components: {
                Button: {
                    meta: { scope: 'mobile' }
                }
            }
        });

        expect(result.strict['new-token']).toBe(100);
        expect(result.components.Button.meta.scope).toBe('mobile');
    });

    it('should preserve version from base', () => {
        const result = createMapping({
            base: baseMapping,
            strict: { 'some-token': 'value' }
        });

        expect(result.version).toBe(1.0);
    });
});

describe('@mapping-base: real-world usage', () => {
    it('should create a Material-like override from Eva base', () => {
        const evaBase = {
            version: 1.0,
            strict: {
                'text-font-family': 'System'
            },
            components: {
                Button: {
                    appearances: {
                        filled: {
                            mapping: {
                                backgroundColor: 'color-primary-default'
                            }
                        }
                    }
                },
                Input: {
                    appearances: {
                        default: {
                            mapping: {
                                backgroundColor: 'background-basic-color-2'
                            }
                        }
                    }
                }
            }
        };

        const materialOverrides = {
            components: {
                Input: {
                    appearances: {
                        default: {
                            mapping: {
                                backgroundColor: 'background-basic-color-1',
                                captionIconWidth: 10
                            }
                        }
                    }
                }
            }
        };

        const result = createMapping({
            base: evaBase,
            components: materialOverrides.components
        });

        // Button should be unchanged
        expect(result.components.Button).toEqual(evaBase.components.Button);

        // Input should have merged properties
        expect(result.components.Input.appearances.default.mapping.backgroundColor)
            .toBe('background-basic-color-1');
        expect(result.components.Input.appearances.default.mapping.captionIconWidth)
            .toBe(10);
    });
});
