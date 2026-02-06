/**
 * Deep merges two objects, with the override taking precedence.
 */
export function deepMerge<T extends object>(base: T, override: Partial<T>): T;

/**
 * Merges a base mapping with design system overrides.
 */
export function mergeMapping(baseMapping: object, overrides: object): object;

/**
 * Options for creating a mapping.
 */
export interface CreateMappingOptions {
  /** Base mapping (shared structure) */
  base: object;
  /** Strict tokens override */
  strict?: Record<string, string | number>;
  /** Component overrides */
  components?: Record<string, object>;
}

/**
 * Creates a complete mapping from base and overrides.
 */
export function createMapping(options: CreateMappingOptions): object;

/**
 * The base mapping containing all component definitions.
 */
export const baseMapping: object;

/**
 * Options for creating a design system.
 */
export interface DesignSystemOverrides {
  /** Strict token overrides */
  strict?: Record<string, string | number>;
  /** Component overrides */
  components?: Record<string, object>;
}

/**
 * Creates a new design system based on the base mapping with overrides.
 */
export function createDesignSystem(overrides: DesignSystemOverrides): object;
