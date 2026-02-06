/**
 * @license
 * Copyright (c) 2024-2026 Vlad Bataev and Kittsune Contributors.
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
 * Checkbox-specific state extending InteractionState.
 */
export interface CheckboxCoreState extends InteractionState {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Whether the checkbox is in indeterminate state */
  indeterminate: boolean;
}

/**
 * Props passed to CheckboxCore's render function.
 */
export interface CheckboxCoreRenderProps {
  /** Current checkbox state */
  state: CheckboxCoreState;
  /** Whether the checkbox is disabled */
  disabled: boolean;
  /** Event handlers to spread onto the touchable */
  handlers: CheckboxCoreHandlers;
  /** Accessibility props to spread onto the touchable */
  accessibilityProps: AccessibilityProps;
  /** Toggle the checkbox state */
  toggle: () => void;
}

/**
 * Event handlers provided by CheckboxCore.
 */
export interface CheckboxCoreHandlers {
  onPressIn: (event: GestureResponderEvent) => void;
  onPressOut: (event: GestureResponderEvent) => void;
  onPress: (event: GestureResponderEvent) => void;
  onMouseEnter?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onMouseLeave?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onFocus: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onBlur: (event: NativeSyntheticEvent<TargetedEvent>) => void;
}

/**
 * Props for CheckboxCore component.
 */
export interface CheckboxCoreProps {
  /** Render function receiving state and handlers */
  children: RenderPropsChildren<CheckboxCoreRenderProps>;
  /** Whether the checkbox is checked (controlled) */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Whether the checkbox is in indeterminate state */
  indeterminate?: boolean;
  /** Called when checked state changes */
  onChange?: (checked: boolean) => void;
  /** Whether the checkbox is disabled */
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
 * Headless checkbox component that manages checked and interaction state.
 *
 * Supports both controlled and uncontrolled modes:
 * - Controlled: Pass `checked` and `onChange` props
 * - Uncontrolled: Pass `defaultChecked`, optionally with `onChange`
 *
 * @example Controlled
 * ```tsx
 * const [checked, setChecked] = useState(false);
 *
 * <CheckboxCore checked={checked} onChange={setChecked}>
 *   {({ state, handlers, accessibilityProps }) => (
 *     <TouchableOpacity {...handlers} {...accessibilityProps}>
 *       <Icon name={state.checked ? 'checkmark' : 'square'} />
 *       <Text>Accept terms</Text>
 *     </TouchableOpacity>
 *   )}
 * </CheckboxCore>
 * ```
 *
 * @example Uncontrolled with indeterminate
 * ```tsx
 * <CheckboxCore defaultChecked={false} indeterminate={someItemsSelected}>
 *   {({ state, handlers }) => (
 *     <TouchableOpacity {...handlers}>
 *       <Icon name={state.indeterminate ? 'minus' : state.checked ? 'check' : 'square'} />
 *     </TouchableOpacity>
 *   )}
 * </CheckboxCore>
 * ```
 */
export const CheckboxCore: React.FC<CheckboxCoreProps> = ({
  children,
  checked: checkedProp,
  defaultChecked = false,
  indeterminate = false,
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
    // When indeterminate, pressing always sets to checked
    if (indeterminate) {
      setChecked(true);
    } else {
      setChecked(!checked);
    }
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

  const state: CheckboxCoreState = {
    pressed,
    hovered,
    focused,
    checked,
    indeterminate,
  };

  const handlers: CheckboxCoreHandlers = {
    ...pressHandlers,
    ...hoverHandlers,
    ...focusHandlers,
  };

  const accessibilityProps: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'checkbox',
    accessibilityState: {
      disabled,
      checked: indeterminate ? 'mixed' : checked,
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
  });
};

CheckboxCore.displayName = 'CheckboxCore';
