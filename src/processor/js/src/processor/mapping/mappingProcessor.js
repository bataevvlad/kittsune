"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("../../service");

/**
 * Memoization caches for expensive operations.
 * These caches are shared across all processor instances within a process.
 */
const variantCombinationCache = new Map();
const stateCombinationCache = new Map();
const componentResultCache = new Map();

/**
 * Creates a cache key from an array of arrays.
 * @param {string[][]} arrays - Array of string arrays
 * @returns {string} - Cache key
 */
function createArrayKey(arrays) {
    return arrays.map(arr => arr.join(',')).join('|');
}

/**
 * Clears all processor caches. Useful for testing or when mapping changes.
 */
function clearProcessorCache() {
    variantCombinationCache.clear();
    stateCombinationCache.clear();
    componentResultCache.clear();
}
exports.clearProcessorCache = clearProcessorCache;

/**
 * Returns the current cache sizes for monitoring.
 * @returns {{ variants: number, states: number, components: number }}
 */
function getProcessorCacheStats() {
    return {
        variants: variantCombinationCache.size,
        states: stateCombinationCache.size,
        components: componentResultCache.size,
    };
}
exports.getProcessorCacheStats = getProcessorCacheStats;

class MappingProcessor {
    process(params) {
        // Clear component cache at the start of processing to avoid stale data
        componentResultCache.clear();

        const result = [];
        const componentKeys = Object.keys(params);

        for (let i = 0; i < componentKeys.length; i++) {
            const component = componentKeys[i];
            const componentMeta = this.getComponentMappingMeta(params, component);
            // Use push instead of spread to avoid array allocation overhead
            for (let j = 0; j < componentMeta.length; j++) {
                result.push(componentMeta[j]);
            }
        }

        return result;
    }

    getComponentMappingMeta(mapping, component) {
        // Check component cache first
        const cacheKey = component;
        if (componentResultCache.has(cacheKey)) {
            return componentResultCache.get(cacheKey);
        }

        const componentMapping = mapping[component];
        // variants and states possible configurations are the same across all appearances, so we can evaluate them once
        const variants = this.getComponentVariants(mapping, component);
        const states = this.getComponentStates(mapping, component);

        const appearanceKeys = Object.keys(componentMapping.appearances);
        const result = new Array(appearanceKeys.length);

        for (let i = 0; i < appearanceKeys.length; i++) {
            result[i] = {
                name: component,
                appearance: appearanceKeys[i],
                variants,
                states,
            };
        }

        componentResultCache.set(cacheKey, result);
        return result;
    }

    getComponentVariants(mapping, component) {
        const needsAllCases = service_1.needsAllVariantCases(mapping, component);
        const variants = service_1.getComponentVariants(mapping, component);

        if (!variants || variants.length === 0) {
            return [];
        }

        // Create cache key for variant combinations
        const cacheKey = createArrayKey(variants) + (needsAllCases ? ':all' : ':default');
        if (variantCombinationCache.has(cacheKey)) {
            return variantCombinationCache.get(cacheKey);
        }

        const result = this.concatComponentVariants([...variants.map(v => [...v])], [], needsAllCases);
        variantCombinationCache.set(cacheKey, result);
        return result;
    }

    getComponentStates(mapping, component) {
        const states = service_1.getComponentStates(mapping, component);

        if (!states || states.length === 0) {
            return [];
        }

        // Create cache key for state combinations
        const cacheKey = states.join(',');
        if (stateCombinationCache.has(cacheKey)) {
            return stateCombinationCache.get(cacheKey);
        }

        const result = this.concatComponentStates([...states]);
        stateCombinationCache.set(cacheKey, result);
        return result;
    }

    concatComponentVariants(variants, result, needsAllCases) {
        if (variants.length === 0) {
            return result;
        }
        if (needsAllCases) {
            // this is the case when there is no default path for variant groups,
            // e.i. not all variant groups values has default values
            // all possible combinations will be evaluated
            const first = variants.shift();
            const concat = variants.reduce((acc, current) => {
                const newItems = this.concatVariantGroups(acc, current);
                // Use push.apply for better performance than spread
                const combined = new Array(acc.length + newItems.length);
                for (let i = 0; i < acc.length; i++) {
                    combined[i] = acc[i];
                }
                for (let i = 0; i < newItems.length; i++) {
                    combined[acc.length + i] = newItems[i];
                }
                return combined;
            }, first);

            // Combine result with concat
            const finalResult = new Array(result.length + concat.length);
            for (let i = 0; i < result.length; i++) {
                finalResult[i] = result[i];
            }
            for (let i = 0; i < concat.length; i++) {
                finalResult[result.length + i] = concat[i];
            }
            return this.concatComponentVariants(variants, finalResult, needsAllCases);
        }
        // by default, we will evaluate only required variant groups combinations
        return variants.reduce((acc, current) => {
            if (acc.length === 0) {
                return current;
            }
            const result = [];
            for (let i = 0; i < acc.length; i++) {
                for (let j = 0; j < current.length; j++) {
                    result.push(acc[i] + service_1.SEPARATOR_MAPPING_ENTRY + current[j]);
                }
            }
            return result;
        }, []);
    }

    concatVariantGroups(lhs, rhs) {
        const result = new Array(lhs.length * rhs.length);
        let idx = 0;
        for (let i = 0; i < lhs.length; i++) {
            const lhsValue = lhs[i];
            for (let j = 0; j < rhs.length; j++) {
                result[idx++] = lhsValue + service_1.SEPARATOR_MAPPING_ENTRY + rhs[j];
            }
        }
        return result;
    }

    concatComponentStates(states, result = []) {
        if (states.length === 0) {
            return result;
        }
        const first = states.shift();
        const acc = [first];

        for (let i = 0; i < states.length; i++) {
            const current = states[i];
            const accLength = acc.length;
            // Add combined states
            for (let j = 0; j < accLength; j++) {
                acc.push(acc[j] + service_1.SEPARATOR_MAPPING_ENTRY + current);
            }
            // Add the current state itself
            acc.push(current);
        }

        // Combine result with acc
        const finalResult = new Array(result.length + acc.length);
        for (let i = 0; i < result.length; i++) {
            finalResult[i] = result[i];
        }
        for (let i = 0; i < acc.length; i++) {
            finalResult[result.length + i] = acc[i];
        }

        return finalResult;
    }
}
exports.MappingProcessor = MappingProcessor;
//# sourceMappingURL=mappingProcessor.js.map
