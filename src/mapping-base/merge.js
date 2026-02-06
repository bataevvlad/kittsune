"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Deep merges two objects, with the override taking precedence.
 * Arrays are replaced, not merged.
 *
 * @param {Object} base - The base object
 * @param {Object} override - The override object
 * @returns {Object} - The merged result
 */
function deepMerge(base, override) {
    if (override === null || override === undefined) {
        return base;
    }

    if (base === null || base === undefined) {
        return override;
    }

    if (typeof base !== 'object' || typeof override !== 'object') {
        return override;
    }

    if (Array.isArray(base) || Array.isArray(override)) {
        return override;
    }

    const result = { ...base };

    for (const key of Object.keys(override)) {
        if (key in base && typeof base[key] === 'object' && typeof override[key] === 'object'
            && !Array.isArray(base[key]) && !Array.isArray(override[key])) {
            result[key] = deepMerge(base[key], override[key]);
        } else {
            result[key] = override[key];
        }
    }

    return result;
}
exports.deepMerge = deepMerge;

/**
 * Merges a base mapping with design system overrides.
 *
 * @param {Object} baseMapping - The shared base mapping
 * @param {Object} overrides - Design system specific overrides
 * @returns {Object} - The complete mapping
 */
function mergeMapping(baseMapping, overrides) {
    return deepMerge(baseMapping, overrides);
}
exports.mergeMapping = mergeMapping;

/**
 * Creates a complete mapping from base and overrides.
 * This is the main entry point for design systems.
 *
 * @param {Object} options
 * @param {Object} options.base - Base mapping (shared structure)
 * @param {Object} options.strict - Strict tokens override
 * @param {Object} options.components - Component overrides
 * @returns {Object} - Complete mapping ready for processing
 */
function createMapping(options) {
    const { base, strict, components } = options;

    const result = { ...base };

    // Merge strict tokens
    if (strict) {
        result.strict = deepMerge(base.strict || {}, strict);
    }

    // Merge component overrides
    if (components) {
        result.components = deepMerge(base.components || {}, components);
    }

    return result;
}
exports.createMapping = createMapping;
//# sourceMappingURL=merge.js.map
