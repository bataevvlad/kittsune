export declare const mapping: any;
export declare const light: any;
export declare const dark: any;

/**
 * Lazy theme loaders for code splitting.
 * Use these when you want to load themes on demand instead of at startup.
 */
export declare function loadLight(): Promise<any>;
export declare function loadDark(): Promise<any>;
export declare function loadMapping(): Promise<any>;
