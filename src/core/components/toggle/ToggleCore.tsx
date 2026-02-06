/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React from 'react';
import type { GestureResponderEvent, NativeSyntheticEvent, TargetedEvent } from 'react-native';
import { useControllableBoolean } from '../../hooks/useControllable';
import { usePressable } from '../../hooks/usePressable';
import { useHoverable } from '../../hooks/useHoverable';
import { useFocusable } from '../../hooks/useFocusable';
import type { InteractionState, AccessibilityProps, RenderPropsChildren } from '../../types/common';

/**
 * Toggle-specific state extending InteractionState.
 */
export interface ToggleCoreState extends InteractionState {
  /** Whether the toggle is checked/on */
  checked: boolean;
}

/**
 * Props passed to ToggleCore's render function.
 */
export interface ToggleCoreRenderProps {
  /** Current toggle state */
  state: ToggleCoreState;
  /** Whether the toggle is disabled */
  disabled: boolean;
  /** Event handlers to spread onto the touchable */
  handlers: ToggleCoreHandlers;
  /** Accessibility props to spread onto the touchable */
  accessibilityProps: AccessibilityProps;
  /** Toggle the checked state */
  toggle: () => void;
  /** Set checked to true */
  turnOn: () => void;
  /** Set checked to false */
  turnOff: () => void;
}

/**
 * Event handlers provided by ToggleCore.
 */
export interface ToggleCoreHandlers {
  onPressIn: (event: GestureResponderEvent) => void;
  onPressOut: (event: GestureResponderEvent) => void;
  onPress: (event: GestureResponderEvent) => void;
  onMouseEnter?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onMouseLeave?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onFocus: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onBlur: (event: NativeSyntheticEvent<TargetedEvent>) => void;
}

/**
 * Props for ToggleCore component.
 */
export interface ToggleCoreProps {
  /** Render function receiving state and handlers */
  children: RenderPropsChildren<ToggleCoreRenderProps>;
  /** Whether the toggle is checked (controlled) */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Called when checked state changes */
  onChange?: (checked: boolean) => void;
  /** Whether the toggle is disabled */
  disabled?: boolean;
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
 * Headless toggle/switch component that manages on/off state.
 *
 * Similar to CheckboxCore but semantically represents a switch/toggle
 * for settings that take effect immediately.
 *
 * @example Controlled toggle
 * ```tsx
 * const [enabled, setEnabled] = useState(false);
 *
 * <ToggleCore checked={enabled} onChange={setEnabled}>
 *   {({ state, handlers, accessibilityProps }) => (
 *     <TouchableOpacity {...handlers} {...accessibilityProps}>
 *       <View style={[styles.track, state.checked && styles.trackOn]}>
 *         <View style={[styles.thumb, state.checked && styles.thumbOn]} />
 *       </View>
 *       <Text>{state.checked ? 'On' : 'Off'}</Text>
 *     </TouchableOpacity>
 *   )}
 * </ToggleCore>
 * ```
 *
 * @example Uncontrolled with callback
 * ```tsx
 * <ToggleCore defaultChecked={false} onChange={(val) => saveSetting(val)}>
 *   {({ state, handlers }) => (
 *     <Switch {...handlers} value={state.checked} />
 *   )}
 * </ToggleCore>
 * ```
 */
export const ToggleCore: React.FC<ToggleCoreProps> = ({
  children,
  checked: checkedProp,
  defaultChecked = false,
  onChange,
  disabled = false,
  onPressIn,
  onPressOut,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { value: checked, setValue: setChecked } = useControllableBoolean({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange,
  });

  const toggle = () => {
    if (disabled) return;
    setChecked(!checked);
  };

  const turnOn = () => {
    if (disabled) return;
    setChecked(true);
  };

  const turnOff = () => {
    if (disabled) return;
    setChecked(false);
  };

  const { pressed, pressHandlers } = usePressable({
    disabled,
    onPress: toggle,
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

  const state: ToggleCoreState = {
    pressed,
    hovered,
    focused,
    checked,
  };

  const handlers: ToggleCoreHandlers = {
    ...pressHandlers,
    ...hoverHandlers,
    ...focusHandlers,
  };

  const accessibilityProps: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'switch',
    accessibilityState: {
      disabled,
      checked,
    },
    accessibilityLabel,
    accessibilityHint,
  };

  return children({
    state,
    disabled,
    handlers,
    accessibilityProps,
    toggle,
    turnOn,
    turnOff,
  });
};

ToggleCore.displayName = 'ToggleCore';
