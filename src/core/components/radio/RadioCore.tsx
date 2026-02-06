/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useContext } from 'react';
import type { GestureResponderEvent, NativeSyntheticEvent, TargetedEvent } from 'react-native';
import { usePressable } from '../../hooks/usePressable';
import { useHoverable } from '../../hooks/useHoverable';
import { useFocusable } from '../../hooks/useFocusable';
import type { InteractionState, AccessibilityProps, RenderPropsChildren } from '../../types/common';
import { RadioGroupCoreContext } from './RadioGroupCore';

/**
 * Radio-specific state extending InteractionState.
 */
export interface RadioCoreState extends InteractionState {
  /** Whether the radio is selected */
  selected: boolean;
}

/**
 * Props passed to RadioCore's render function.
 */
export interface RadioCoreRenderProps {
  /** Current radio state */
  state: RadioCoreState;
  /** Whether the radio is disabled */
  disabled: boolean;
  /** Event handlers to spread onto the touchable */
  handlers: RadioCoreHandlers;
  /** Accessibility props to spread onto the touchable */
  accessibilityProps: AccessibilityProps;
  /** Select this radio option */
  select: () => void;
}

/**
 * Event handlers provided by RadioCore.
 */
export interface RadioCoreHandlers {
  onPressIn: (event: GestureResponderEvent) => void;
  onPressOut: (event: GestureResponderEvent) => void;
  onPress: (event: GestureResponderEvent) => void;
  onMouseEnter?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onMouseLeave?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onFocus: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onBlur: (event: NativeSyntheticEvent<TargetedEvent>) => void;
}

/**
 * Props for RadioCore component.
 */
export interface RadioCoreProps<T = string> {
  /** Render function receiving state and handlers */
  children: RenderPropsChildren<RadioCoreRenderProps>;
  /** The value this radio represents */
  value: T;
  /** Whether this radio is selected (standalone mode) */
  selected?: boolean;
  /** Called when this radio is selected (standalone mode) */
  onSelect?: (value: T) => void;
  /** Whether the radio is disabled */
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
 * Headless radio component that manages selection and interaction state.
 *
 * Can be used standalone or within a RadioGroupCore for mutual exclusivity.
 *
 * @example Standalone
 * ```tsx
 * const [selected, setSelected] = useState('option1');
 *
 * <RadioCore
 *   value="option1"
 *   selected={selected === 'option1'}
 *   onSelect={setSelected}
 * >
 *   {({ state, handlers, accessibilityProps }) => (
 *     <TouchableOpacity {...handlers} {...accessibilityProps}>
 *       <Circle filled={state.selected} />
 *       <Text>Option 1</Text>
 *     </TouchableOpacity>
 *   )}
 * </RadioCore>
 * ```
 *
 * @example Within RadioGroupCore
 * ```tsx
 * <RadioGroupCore value={selected} onChange={setSelected}>
 *   <RadioCore value="a">
 *     {({ state, handlers }) => <MyRadioUI {...} />}
 *   </RadioCore>
 *   <RadioCore value="b">
 *     {({ state, handlers }) => <MyRadioUI {...} />}
 *   </RadioCore>
 * </RadioGroupCore>
 * ```
 */
export function RadioCore<T = string>({
  children,
  value,
  selected: selectedProp,
  onSelect,
  disabled: disabledProp = false,
  onPressIn,
  onPressOut,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  accessibilityLabel,
  accessibilityHint,
}: RadioCoreProps<T>): React.ReactElement | null {
  const groupContext = useContext(RadioGroupCoreContext);

  // Determine if selected (group context takes precedence)
  const isSelected = groupContext
    ? groupContext.value === value
    : selectedProp ?? false;

  // Determine if disabled (group or prop)
  const disabled = groupContext?.disabled || disabledProp;

  const select = () => {
    if (disabled) return;

    if (groupContext) {
      groupContext.onChange(value);
    } else {
      onSelect?.(value);
    }
  };

  const { pressed, pressHandlers } = usePressable({
    disabled,
    onPress: select,
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

  const state: RadioCoreState = {
    pressed,
    hovered,
    focused,
    selected: isSelected,
  };

  const handlers: RadioCoreHandlers = {
    ...pressHandlers,
    ...hoverHandlers,
    ...focusHandlers,
  };

  const accessibilityProps: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'radio',
    accessibilityState: {
      disabled,
      selected: isSelected,
      checked: isSelected,
    },
    accessibilityLabel,
    accessibilityHint,
  };

  return children({
    state,
    disabled,
    handlers,
    accessibilityProps,
    select,
  });
}

RadioCore.displayName = 'RadioCore';
