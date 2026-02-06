/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Copyright (c) 2024-2026 Vlad Bataev and Kittsune Contributors.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { useContext, useMemo, useState, useCallback, useRef } from 'react';
import { ThemeStyleType } from '@kitsuine/processor';
import { StyleConsumerService } from './styleConsumer.service';
import { Interaction, StyleType } from './style.service';
import { styleCache } from './styleCache';
import { MappingContext } from '../mapping/mappingContext';
import { ThemeContext } from '../theme/themeContext';
import { ThemeType } from '../theme/theme.service';
import { ThemedThemeType } from '../theme/themeStore';

export interface UseStyledResult {
  style: StyleType;
  theme: ThemeType;
  dispatch: (interactions: Interaction[]) => void;
}

export interface UseStyledOptions {
  appearance?: string;
  status?: string;
  size?: string;
  category?: string;
  disabled?: boolean;
  checked?: boolean;
  selected?: boolean;
  indeterminate?: boolean;
  level?: string;
  shape?: string;
  // Calendar-specific props
  bounding?: boolean;
  today?: boolean;
  range?: boolean;
  [key: string]: unknown;
}

/**
 * Modern hook-based alternative to @styled decorator.
 * Computes Eva Design System styles for a component based on its props and current interactions.
 */
export function useStyled(
  componentName: string,
  options: UseStyledOptions = {},
): UseStyledResult {
  const mapping = useContext(MappingContext);
  const theme = useContext(ThemeContext);
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  // Cache service and default props, re-create when mapping changes
  const serviceRef = useRef<StyleConsumerService | null>(null);
  const defaultPropsRef = useRef<Record<string, unknown>>({});
  const mappingRef = useRef<unknown>(null);

  if (mapping && Object.keys(mapping).length > 0 && mapping !== mappingRef.current) {
    mappingRef.current = mapping;
    serviceRef.current = new StyleConsumerService(componentName, mapping as ThemeStyleType);
    defaultPropsRef.current = serviceRef.current.createDefaultProps() as Record<string, unknown>;
  }

  const service = serviceRef.current;
  const defaultProps = defaultPropsRef.current;

  // Compute style with caching
  const style = useMemo(() => {
    if (!service || !mapping || !theme || Object.keys(theme).length === 0) {
      return {};
    }

    // Get theme ID for cache key (from ThemeStore or fallback)
    const themeId = (theme as ThemedThemeType).__themeId ?? 'default';

    // Build variants object for cache key
    const variants: Record<string, string | boolean | undefined> = {
      status: options.status,
      size: options.size,
      category: options.category,
      level: options.level,
      shape: options.shape,
      disabled: options.disabled,
      checked: options.checked,
      selected: options.selected,
      indeterminate: options.indeterminate,
      bounding: options.bounding,
      today: options.today,
      range: options.range,
    };

    // Try cache first
    const cacheKey = styleCache.buildKey(
      componentName,
      options.appearance,
      variants,
      interactions,
      themeId,
    );

    const cached = styleCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Cache miss - compute style
    const mergedProps: Record<string, unknown> = { ...defaultProps };
    Object.keys(options).forEach((key) => {
      if (options[key] !== undefined) {
        mergedProps[key] = options[key];
      }
    });

    const computed = service.createStyleProp(
      mergedProps,
      mapping as ThemeStyleType,
      theme,
      interactions,
    );

    // Store in cache
    styleCache.set(cacheKey, computed);

    return computed;
  }, [
    service,
    defaultProps,
    componentName,
    // Common props used by most styled components
    options.appearance,
    options.status,
    options.size,
    options.category,
    options.disabled,
    options.checked,
    options.selected,
    options.indeterminate,
    options.level,
    options.shape,
    // Calendar-specific props
    options.bounding,
    options.today,
    options.range,
    mapping,
    theme,
    interactions,
  ]);

  // Stable dispatch function
  const dispatch = useCallback((newInteractions: Interaction[]) => {
    setInteractions(newInteractions);
  }, []);

  return { style, theme, dispatch };
}

/**
 * Hook to get default props for a styled component.
 */
export function useStyledDefaultProps(componentName: string): Record<string, unknown> {
  const mapping = useContext(MappingContext);

  return useMemo(() => {
    if (!mapping || Object.keys(mapping).length === 0) {
      return {};
    }
    const service = new StyleConsumerService(componentName, mapping as ThemeStyleType);
    return service.createDefaultProps() as Record<string, unknown>;
  }, [componentName, mapping]);
}
