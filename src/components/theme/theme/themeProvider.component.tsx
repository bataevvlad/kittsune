/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useRef, useEffect, useMemo } from 'react';
import { ThemeContext } from './themeContext';
import { ThemeService, ThemeType } from './theme.service';
import { ThemeStore, ThemeStoreContext } from './themeStore';
import { styleCache } from '../style/styleCache';

export interface ThemeProviderProps {
  theme: ThemeType;
  children?: React.ReactNode;
}

/**
 * Since ApplicationProvider is the root component of the application,
 * it provides same theme for all underlying components.
 *
 * ThemeProvider allows modifying this theme so that each component that is the child
 * of ThemeProvider will use modified theme.
 *
 * Now also integrates with ThemeStore for selective subscriptions via useThemeValue hooks.
 *
 * @overview-example ThemeProviderSimpleUsage
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  // Create ThemeStore instance once
  const storeRef = useRef<ThemeStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new ThemeStore();
  }
  const store = storeRef.current;

  // Track previous theme ID for cache invalidation
  const prevThemeIdRef = useRef<string | undefined>(undefined);

  // Update store when theme changes
  useEffect(() => {
    const previousThemeId = prevThemeIdRef.current;

    // Update the store with new theme
    store.setTheme(theme);

    // Get new theme ID
    const newThemeId = store.getThemeId();

    // Invalidate old theme cache entries if theme changed
    if (previousThemeId && previousThemeId !== newThemeId) {
      styleCache.invalidateTheme(previousThemeId);
    }

    prevThemeIdRef.current = newThemeId;
  }, [theme, store]);

  // Get processed theme from store for ThemeContext
  // Use useMemo to ensure stable reference when theme hasn't changed
  const processedTheme = useMemo(() => {
    return ThemeService.create(theme);
  }, [theme]);

  // Add __themeId to the processed theme for cache key usage
  const themedWithId = useMemo(() => {
    return {
      ...processedTheme,
      __themeId: store.getThemeId(),
    };
  }, [processedTheme, store]);

  return (
    <ThemeStoreContext.Provider value={store}>
      <ThemeContext.Provider value={themedWithId}>
        {children}
      </ThemeContext.Provider>
    </ThemeStoreContext.Provider>
  );
};
