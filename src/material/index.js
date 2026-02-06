"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

// Existing exports - synchronous (backward compatible)
exports.mapping = require('./mapping.json');
exports.light = require('./themes/light.json');
exports.dark = require('./themes/dark.json');

/**
 * Lazy theme loaders for code splitting.
 * Use these when you want to load themes on demand instead of at startup.
 *
 * Example:
 * ```javascript
 * const { loadLight, loadDark } = require('@kitsuine/material');
 *
 * // Load only the theme you need
 * const lightTheme = await loadLight();
 * ```
 */
exports.loadLight = function() {
  return Promise.resolve(require('./themes/light.json'));
};

exports.loadDark = function() {
  return Promise.resolve(require('./themes/dark.json'));
};

exports.loadMapping = function() {
  return Promise.resolve(require('./mapping.json'));
};
//# sourceMappingURL=index.js.map
