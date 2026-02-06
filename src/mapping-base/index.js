"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const merge = require('./merge');

/**
 * @kittsune/mapping-base
 *
 * Provides utilities for creating and merging design system mappings.
 * This package is used internally by @kittsune/eva and @kittsune/material,
 * and can be used to create custom design systems.
 *
 * Usage:
 * ```javascript
 * const { createMapping, mergeMapping } = require('@kittsune/mapping-base');
 * const baseMapping = require('@kittsune/mapping-base/mapping.json');
 *
 * const customMapping = createMapping({
 *   base: baseMapping,
 *   strict: {
 *     // Override strict tokens
 *     'text-font-family': 'Roboto'
 *   },
 *   components: {
 *     // Override component styles
 *     Button: {
 *       appearances: {
 *         filled: {
 *           mapping: {
 *             backgroundColor: 'my-custom-color'
 *           }
 *         }
 *       }
 *     }
 *   }
 * });
 * ```
 */

// Export merge utilities
exports.deepMerge = merge.deepMerge;
exports.mergeMapping = merge.mergeMapping;
exports.createMapping = merge.createMapping;

// Export base mapping
exports.baseMapping = require('./mapping.json');

/**
 * Creates a new design system based on the base mapping with overrides.
 * This is a convenience function that combines base loading and merging.
 *
 * @param {Object} overrides - Design system specific overrides
 * @param {Object} overrides.strict - Strict token overrides
 * @param {Object} overrides.components - Component overrides
 * @returns {Object} - Complete mapping ready for processing
 */
exports.createDesignSystem = function(overrides) {
    return merge.createMapping({
        base: exports.baseMapping,
        strict: overrides.strict,
        components: overrides.components
    });
};
//# sourceMappingURL=index.js.map
