"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mappingProcessor_1 = require("./mappingProcessor");
const mappingProcessor_spec_config_1 = require("./mappingProcessor.spec.config");

describe('@processor: service checks', () => {
    const processor = new mappingProcessor_1.MappingProcessor();

    beforeEach(() => {
        // Clear cache before each test
        mappingProcessor_1.clearProcessorCache();
    });

    it('* processes mapping properly', () => {
        const value = processor.process(mappingProcessor_spec_config_1.mapping);
        expect(value).toMatchSnapshot();
    });

    it('* produces consistent results with caching', () => {
        const result1 = processor.process(mappingProcessor_spec_config_1.mapping);
        const result2 = processor.process(mappingProcessor_spec_config_1.mapping);

        expect(result1).toEqual(result2);
    });
});

describe('@processor: memoization checks', () => {
    const processor = new mappingProcessor_1.MappingProcessor();

    beforeEach(() => {
        mappingProcessor_1.clearProcessorCache();
    });

    it('should start with empty cache', () => {
        const stats = mappingProcessor_1.getProcessorCacheStats();

        expect(stats.variants).toBe(0);
        expect(stats.states).toBe(0);
        expect(stats.components).toBe(0);
    });

    it('should populate variant cache during processing', () => {
        processor.process(mappingProcessor_spec_config_1.mapping);

        const stats = mappingProcessor_1.getProcessorCacheStats();

        // Variant combinations should be cached
        expect(stats.variants).toBeGreaterThan(0);
    });

    it('should populate state cache during processing', () => {
        processor.process(mappingProcessor_spec_config_1.mapping);

        const stats = mappingProcessor_1.getProcessorCacheStats();

        // State combinations should be cached
        expect(stats.states).toBeGreaterThan(0);
    });

    it('should clear all caches when clearProcessorCache is called', () => {
        processor.process(mappingProcessor_spec_config_1.mapping);

        let stats = mappingProcessor_1.getProcessorCacheStats();
        expect(stats.variants).toBeGreaterThan(0);
        expect(stats.states).toBeGreaterThan(0);

        mappingProcessor_1.clearProcessorCache();

        stats = mappingProcessor_1.getProcessorCacheStats();
        expect(stats.variants).toBe(0);
        expect(stats.states).toBe(0);
        expect(stats.components).toBe(0);
    });

    it('should reuse cached variant combinations across processors', () => {
        const processor1 = new mappingProcessor_1.MappingProcessor();
        const processor2 = new mappingProcessor_1.MappingProcessor();

        processor1.process(mappingProcessor_spec_config_1.mapping);
        const statsAfterFirst = mappingProcessor_1.getProcessorCacheStats();

        processor2.process(mappingProcessor_spec_config_1.mapping);
        const statsAfterSecond = mappingProcessor_1.getProcessorCacheStats();

        // Cache sizes should be the same (reusing cached values)
        expect(statsAfterSecond.variants).toBe(statsAfterFirst.variants);
        expect(statsAfterSecond.states).toBe(statsAfterFirst.states);
    });
});

describe('@processor: performance optimization checks', () => {
    const processor = new mappingProcessor_1.MappingProcessor();

    beforeEach(() => {
        mappingProcessor_1.clearProcessorCache();
    });

    it('should handle empty mapping', () => {
        const result = processor.process({});
        expect(result).toEqual([]);
    });

    it('should handle components with no variants', () => {
        const simpleMapping = {
            SimpleComponent: {
                meta: {
                    scope: 'all',
                    parameters: {},
                    appearances: {
                        default: { default: true }
                    },
                    variantGroups: {},
                    states: {}
                },
                appearances: {
                    default: {
                        mapping: {}
                    }
                }
            }
        };

        const result = processor.process(simpleMapping);

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('SimpleComponent');
        expect(result[0].variants).toEqual([]);
        expect(result[0].states).toEqual([]);
    });

    it('should handle components with multiple appearances', () => {
        const multiAppearanceMapping = {
            StyledComponent: {
                meta: {
                    scope: 'all',
                    parameters: {},
                    appearances: {
                        default: { default: true },
                        outline: { default: false },
                        ghost: { default: false }
                    },
                    variantGroups: {},
                    states: {}
                },
                appearances: {
                    default: { mapping: {} },
                    outline: { mapping: {} },
                    ghost: { mapping: {} }
                }
            }
        };

        const result = processor.process(multiAppearanceMapping);

        expect(result).toHaveLength(3);
        expect(result.map(r => r.appearance)).toEqual(['default', 'outline', 'ghost']);
    });
});
//# sourceMappingURL=mappingProcessor.spec.js.map
