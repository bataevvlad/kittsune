/**
 * @license
 * Copyright (c) 2024-2026 Vlad Bataev and Kittsune Contributors.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { useMemo } from 'react';
import { useStyled, UseStyledOptions } from './useStyled';
import { Interaction, StyleType } from './style.service';

/**
 * Options for useEvaStyle hook.
 * Maps Core's InteractionState to Eva styling options.
 */
export interface EvaStyleOptions {
  /** Component appearance (e.g., 'filled', 'outline', 'ghost') */
  appearance?: string;
  /** Component status (e.g., 'primary', 'success', 'danger') */
  status?: string;
  /** Component size (e.g., 'tiny', 'small', 'medium', 'large', 'giant') */
  size?: string;
  /** Interaction states from Core components */
  states?: {
    /** Maps to Interaction.ACTIVE */
    active?: boolean;
    /** Maps to Interaction.HOVER */
    hover?: boolean;
    /** Maps to Interaction.FOCUSED */
    focused?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Checked state (for checkboxes, radio, toggle) */
    checked?: boolean;
    /** Selected state */
    selected?: boolean;
    /** Indeterminate state (for checkboxes) */
    indeterminate?: boolean;
  };
}

/**
 * Split styles for Eva components.
 * Eva Design System combines all styles into a single object.
 * This interface provides a convenient split into container, text, and icon styles.
 */
export interface SplitStyles {
  /** Container/wrapper styles */
  container: StyleType;
  /** Text element styles */
  text: StyleType;
  /** Icon element styles */
  icon: StyleType;
}

/**
 * Result from useEvaStyle hook.
 */
export interface UseEvaStyleResult {
  /** Split styles for container, text, and icon */
  styles: SplitStyles;
  /** Raw combined Eva style (for advanced usage) */
  rawStyle: StyleType;
}

/**
 * Maps Core interaction states to Eva Interaction array.
 */
function mapStatesToInteractions(states: EvaStyleOptions['states'] = {}): Interaction[] {
  const interactions: Interaction[] = [];

  if (states.active) {
    interactions.push(Interaction.ACTIVE);
  }
  if (states.hover) {
    interactions.push(Interaction.HOVER);
  }
  if (states.focused) {
    interactions.push(Interaction.FOCUSED);
  }
  if (states.indeterminate) {
    interactions.push(Interaction.INDETERMINATE);
  }

  return interactions;
}

/**
 * Splits Eva's combined style object into container, text, and icon styles.
 */
function splitEvaStyle(evaStyle: StyleType): SplitStyles {
  const {
    // Text-related properties
    textColor,
    textFontFamily,
    textFontSize,
    textFontWeight,
    textMarginHorizontal,
    textLineHeight,
    textPaddingHorizontal,
    // Icon-related properties
    iconWidth,
    iconHeight,
    iconTintColor,
    iconMarginHorizontal,
    // Everything else goes to container
    ...containerParameters
  } = evaStyle;

  return {
    container: containerParameters,
    text: {
      color: textColor,
      fontFamily: textFontFamily,
      fontSize: textFontSize,
      fontWeight: textFontWeight,
      marginHorizontal: textMarginHorizontal,
      lineHeight: textLineHeight,
      paddingHorizontal: textPaddingHorizontal,
    },
    icon: {
      width: iconWidth,
      height: iconHeight,
      tintColor: iconTintColor,
      marginHorizontal: iconMarginHorizontal,
    },
  };
}

/**
 * Bridge hook between @kitsuine/core headless components and Eva Design System styling.
 *
 * Maps Core's InteractionState (pressed, hovered, focused) to Eva's Interaction enum
 * and computes split styles ready to apply to container, text, and icon elements.
 *
 * @example
 * ```tsx
 * import { ButtonCore } from '@kitsuine/core';
 * import { useEvaStyle } from '@kitsuine/components';
 *
 * function MyButton({ appearance, status, size, disabled, children }) {
 *   return (
 *     <ButtonCore disabled={disabled}>
 *       {({ state, handlers, accessibilityProps }) => {
 *         const { styles } = useEvaStyle('Button', {
 *           appearance,
 *           status,
 *           size,
 *           states: {
 *             active: state.pressed,
 *             hover: state.hovered,
 *             focused: state.focused,
 *             disabled,
 *           },
 *         });
 *
 *         return (
 *           <TouchableOpacity {...handlers} {...accessibilityProps} style={styles.container}>
 *             <Text style={styles.text}>{children}</Text>
 *           </TouchableOpacity>
 *         );
 *       }}
 *     </ButtonCore>
 *   );
 * }
 * ```
 *
 * @param componentName - The Eva component name (e.g., 'Button', 'CheckBox')
 * @param options - Style options including appearance, status, size, and states
 * @returns Split styles for container, text, and icon elements
 */
export function useEvaStyle(
  componentName: string,
  options: EvaStyleOptions = {},
): UseEvaStyleResult {
  const { appearance, status, size, states = {} } = options;

  // Map Core states to Eva Interaction array
  const interactions = useMemo(
    () => mapStatesToInteractions(states),
    [states.active, states.hover, states.focused, states.indeterminate],
  );

  // Build useStyled options
  const styledOptions: UseStyledOptions = useMemo(
    () => ({
      appearance,
      status,
      size,
      disabled: states.disabled,
      checked: states.checked,
      selected: states.selected,
      indeterminate: states.indeterminate,
    }),
    [
      appearance,
      status,
      size,
      states.disabled,
      states.checked,
      states.selected,
      states.indeterminate,
    ],
  );

  // Get Eva style using the underlying useStyled hook
  const { style: rawStyle, dispatch } = useStyled(componentName, styledOptions);

  // Dispatch interactions whenever they change
  useMemo(() => {
    dispatch(interactions);
  }, [dispatch, interactions]);

  // Split the combined style into container, text, and icon parts
  const styles = useMemo(
    () => splitEvaStyle(rawStyle),
    [rawStyle],
  );

  return { styles, rawStyle };
}
