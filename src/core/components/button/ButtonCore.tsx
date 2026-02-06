/**
 * @license
 * Copyright (c) 2024-2026 Vlad Bataev and Kittsune Contributors.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React from 'react';
import type { GestureResponderEvent, NativeSyntheticEvent, TargetedEvent } from 'react-native';
import { usePressable } from '../../hooks/usePressable';
import { useHoverable } from '../../hooks/useHoverable';
import { useFocusable } from '../../hooks/useFocusable';
import type { InteractionState, AccessibilityProps, RenderPropsChildren } from '../../types/common';

/**
 * Props passed to ButtonCore's render function.
 */
export interface ButtonCoreRenderProps {
  /** Current interaction state */
  state: InteractionState;
  /** Whether the button is disabled */
  disabled: boolean;
  /** Event handlers to spread onto the touchable */
  handlers: ButtonCoreHandlers;
  /** Accessibility props to spread onto the touchable */
  accessibilityProps: AccessibilityProps;
}

/**
 * Event handlers provided by ButtonCore.
 */
export interface ButtonCoreHandlers {
  onPressIn: (event: GestureResponderEvent) => void;
  onPressOut: (event: GestureResponderEvent) => void;
  onPress: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  onMouseEnter?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onMouseLeave?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onFocus: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onBlur: (event: NativeSyntheticEvent<TargetedEvent>) => void;
}

/**
 * Props for ButtonCore component.
 */
export interface ButtonCoreProps {
  /** Render function receiving interaction state and handlers */
  children: RenderPropsChildren<ButtonCoreRenderProps>;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Callback when button is pressed */
  onPress?: (event: GestureResponderEvent) => void;
  /** Callback when button is long pressed */
  onLongPress?: (event: GestureResponderEvent) => void;
  /** Delay before onLongPress is triggered (ms) */
  delayLongPress?: number;
  /** Callback when press starts */
  onPressIn?: (event: GestureResponderEvent) => void;
  /** Callback when press ends */
  onPressOut?: (event: GestureResponderEvent) => void;
  /** Callback when mouse enters (web) */
  onMouseEnter?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  /** Callback when mouse leaves (web) */
  onMouseLeave?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  /** Callback when focused */
  onFocus?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  /** Callback when blurred */
  onBlur?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
}

/**
 * Headless button component that manages interaction state.
 *
 * ButtonCore doesn't render any UI - it provides state and handlers
 * via render props that you use to build your own button UI.
 *
 * @example
 * ```tsx
 * <ButtonCore onPress={() => console.log('Pressed!')} disabled={false}>
 *   {({ state, handlers, accessibilityProps }) => (
 *     <TouchableOpacity
 *       {...handlers}
 *       {...accessibilityProps}
 *       style={{ opacity: state.pressed ? 0.7 : 1 }}
 *     >
 *       <Text>{state.pressed ? 'Pressing...' : 'Press me'}</Text>
 *     </TouchableOpacity>
 *   )}
 * </ButtonCore>
 * ```
 */
export const ButtonCore: React.FC<ButtonCoreProps> = ({
  children,
  disabled = false,
  onPress,
  onLongPress,
  delayLongPress,
  onPressIn,
  onPressOut,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { pressed, pressHandlers } = usePressable({
    disabled,
    onPress,
    onLongPress,
    delayLongPress,
    onPressIn,
    onPressOut,
  });

  const { hovered, hoverHandlers } = useHoverable({
    disabled,
    onMouseEnter,
    onMouseLeave,
  });

  const { focused, focusHandlers } = useFocusable({
    disabled,
    onFocus,
    onBlur,
  });

  const state: InteractionState = {
    pressed,
    hovered,
    focused,
  };

  const handlers: ButtonCoreHandlers = {
    ...pressHandlers,
    ...hoverHandlers,
    ...focusHandlers,
  };

  const accessibilityProps: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityState: {
      disabled,
    },
    accessibilityLabel,
    accessibilityHint,
  };

  return children({
    state,
    disabled,
    handlers,
    accessibilityProps,
  });
};

ButtonCore.displayName = 'ButtonCore';
