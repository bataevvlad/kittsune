/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { useContext, useMemo, useState, useCallback, useRef } from 'react';
import { ThemeStyleType } from '@kitsuine/processor';
import { StyleConsumerService } from './styleConsumer.service';
import { Interaction, StyleType } from './style.service';
import { MappingContext } from '../mapping/mappingContext';
import { ThemeContext } from '../theme/themeContext';
import { ThemeType } from '../theme/theme.service';

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

  // Cache service and default props
  const serviceRef = useRef<StyleConsumerService | null>(null);
  const defaultPropsRef = useRef<Record<string, unknown>>({});

  // Initialize service once when mapping is available
  if (mapping && Object.keys(mapping).length > 0 && !serviceRef.current) {
    serviceRef.current = new StyleConsumerService(componentName, mapping as ThemeStyleType);
    defaultPropsRef.current = serviceRef.current.createDefaultProps() as Record<string, unknown>;
  }

  const service = serviceRef.current;
  const defaultProps = defaultPropsRef.current;

  // Compute style - use refs to avoid unnecessary recomputation
  const style = useMemo(() => {
    if (!service || !mapping || !theme || Object.keys(theme).length === 0) {
      return {};
    }

    // Merge default props with provided options
    const mergedProps: Record<string, unknown> = { ...defaultProps };
    Object.keys(options).forEach((key) => {
      if (options[key] !== undefined) {
        mergedProps[key] = options[key];
      }
    });

    return service.createStyleProp(
      mergedProps,
      mapping as ThemeStyleType,
      theme,
      interactions,
    );
  }, [
    service,
    defaultProps,
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
