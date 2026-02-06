/**
 * @license
 * Copyright (c) 2024-2026 Vlad Bataev and Kittsune Contributors.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { createContext, useMemo } from 'react';
import { useControllable } from '../../hooks/useControllable';
import type { AccessibilityProps } from '../../types/common';

/**
 * Context for RadioGroupCore to communicate with RadioCore children.
 */
export interface RadioGroupCoreContextValue<T = unknown> {
  /** Currently selected value */
  value: T | undefined;
  /** Called when a radio is selected */
  onChange: (value: T) => void;
  /** Whether the group is disabled */
  disabled: boolean;
}

export const RadioGroupCoreContext = createContext<RadioGroupCoreContextValue | null>(null);

/**
 * Props passed to RadioGroupCore's render function (if using render props).
 */
export interface RadioGroupCoreRenderProps<T> {
  /** Currently selected value */
  value: T | undefined;
  /** Whether the group is disabled */
  disabled: boolean;
  /** Accessibility props to spread onto the container */
  accessibilityProps: AccessibilityProps;
}

/**
 * Props for RadioGroupCore component.
 */
export interface RadioGroupCoreProps<T = string> {
  /** RadioCore children or render function */
  children: React.ReactNode | ((props: RadioGroupCoreRenderProps<T>) => React.ReactElement);
  /** Currently selected value (controlled) */
  value?: T;
  /** Default selected value (uncontrolled) */
  defaultValue?: T;
  /** Called when selection changes */
  onChange?: (value: T) => void;
  /** Whether the entire group is disabled */
  disabled?: boolean;
  /** Accessibility label for the group */
  accessibilityLabel?: string;
}

/**
 * Headless radio group that provides context for RadioCore children.
 *
 * Manages selection state and ensures mutual exclusivity - only one
 * radio in the group can be selected at a time.
 *
 * @example Basic usage
 * ```tsx
 * const [selected, setSelected] = useState('a');
 *
 * <RadioGroupCore value={selected} onChange={setSelected}>
 *   <RadioCore value="a">
 *     {({ state, handlers }) => (
 *       <TouchableOpacity {...handlers}>
 *         <Circle filled={state.selected} />
 *         <Text>Option A</Text>
 *       </TouchableOpacity>
 *     )}
 *   </RadioCore>
 *   <RadioCore value="b">
 *     {({ state, handlers }) => (
 *       <TouchableOpacity {...handlers}>
 *         <Circle filled={state.selected} />
 *         <Text>Option B</Text>
 *       </TouchableOpacity>
 *     )}
 *   </RadioCore>
 * </RadioGroupCore>
 * ```
 *
 * @example Uncontrolled
 * ```tsx
 * <RadioGroupCore defaultValue="a" onChange={(val) => console.log(val)}>
 *   <RadioCore value="a">{...}</RadioCore>
 *   <RadioCore value="b">{...}</RadioCore>
 * </RadioGroupCore>
 * ```
 */
export function RadioGroupCore<T = string>({
  children,
  value: valueProp,
  defaultValue,
  onChange,
  disabled = false,
  accessibilityLabel,
}: RadioGroupCoreProps<T>): React.ReactElement {
  const { value, setValue } = useControllable<T | undefined>({
    value: valueProp,
    defaultValue,
    onChange,
  });

  const contextValue = useMemo<RadioGroupCoreContextValue>(
    () => ({
      value,
      onChange: setValue as (value: unknown) => void,
      disabled,
    }),
    [value, setValue, disabled],
  );

  const accessibilityProps: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'radiogroup',
    accessibilityLabel,
  };

  // Support both render props and regular children
  const content = typeof children === 'function'
    ? children({ value, disabled, accessibilityProps })
    : children;

  return (
    <RadioGroupCoreContext.Provider value={contextValue}>
      {content}
    </RadioGroupCoreContext.Provider>
  );
}

RadioGroupCore.displayName = 'RadioGroupCore';
