/**
 * @license
 * Copyright (c) 2024-2026 Vlad Bataev and Kittsune Contributors.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useCallback } from 'react';
import type { GestureResponderEvent, NativeSyntheticEvent, TargetedEvent } from 'react-native';
import { useControllable } from '../../hooks/useControllable';
import { usePressable } from '../../hooks/usePressable';
import { useHoverable } from '../../hooks/useHoverable';
import { useFocusable } from '../../hooks/useFocusable';
import type { InteractionState, AccessibilityProps, RenderPropsChildren } from '../../types/common';

/**
 * Select-specific state extending InteractionState.
 */
export interface SelectCoreState<T> extends InteractionState {
  /** Currently selected value(s) */
  selectedValue: T | T[] | undefined;
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Whether multiple selection is enabled */
  multiSelect: boolean;
}

/**
 * Props passed to SelectCore's render function.
 */
export interface SelectCoreRenderProps<T> {
  /** Current select state */
  state: SelectCoreState<T>;
  /** Whether the select is disabled */
  disabled: boolean;
  /** Event handlers for the trigger/button */
  triggerHandlers: SelectCoreTriggerHandlers;
  /** Accessibility props for the trigger */
  accessibilityProps: AccessibilityProps;
  /** Open the dropdown */
  open: () => void;
  /** Close the dropdown */
  close: () => void;
  /** Toggle the dropdown */
  toggle: () => void;
  /** Select a value */
  select: (value: T) => void;
  /** Deselect a value (multi-select only) */
  deselect: (value: T) => void;
  /** Clear selection */
  clear: () => void;
  /** Check if a value is selected */
  isSelected: (value: T) => boolean;
}

/**
 * Event handlers for the select trigger.
 */
export interface SelectCoreTriggerHandlers {
  onPressIn: (event: GestureResponderEvent) => void;
  onPressOut: (event: GestureResponderEvent) => void;
  onPress: (event: GestureResponderEvent) => void;
  onMouseEnter?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onMouseLeave?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onFocus: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onBlur: (event: NativeSyntheticEvent<TargetedEvent>) => void;
}

/**
 * Props for SelectCore component.
 */
export interface SelectCoreProps<T> {
  /** Render function receiving state and handlers */
  children: RenderPropsChildren<SelectCoreRenderProps<T>>;
  /** Currently selected value(s) - controlled */
  value?: T | T[];
  /** Default selected value(s) - uncontrolled */
  defaultValue?: T | T[];
  /** Called when selection changes */
  onChange?: (value: T | T[] | undefined) => void;
  /** Whether multiple selection is allowed */
  multiSelect?: boolean;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Called when dropdown opens */
  onOpen?: () => void;
  /** Called when dropdown closes */
  onClose?: () => void;
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
  /** Compare function for value equality */
  compareValues?: (a: T, b: T) => boolean;
}

/**
 * Headless select/dropdown component that manages selection and open state.
 *
 * Supports both single and multi-select modes. Does not render the dropdown
 * itself - you control the dropdown UI and use the provided state/methods.
 *
 * @example Single select
 * ```tsx
 * const [selected, setSelected] = useState<string>();
 *
 * <SelectCore value={selected} onChange={setSelected}>
 *   {({ state, triggerHandlers, open, close, select, isSelected }) => (
 *     <>
 *       <TouchableOpacity {...triggerHandlers}>
 *         <Text>{state.selectedValue || 'Select...'}</Text>
 *         <Icon name={state.isOpen ? 'chevron-up' : 'chevron-down'} />
 *       </TouchableOpacity>
 *
 *       {state.isOpen && (
 *         <View style={styles.dropdown}>
 *           {options.map(opt => (
 *             <TouchableOpacity
 *               key={opt.value}
 *               onPress={() => { select(opt.value); close(); }}
 *             >
 *               <Text>{opt.label}</Text>
 *               {isSelected(opt.value) && <Icon name="check" />}
 *             </TouchableOpacity>
 *           ))}
 *         </View>
 *       )}
 *     </>
 *   )}
 * </SelectCore>
 * ```
 *
 * @example Multi-select
 * ```tsx
 * <SelectCore<string> multiSelect value={selected} onChange={setSelected}>
 *   {({ state, select, deselect, isSelected }) => (
 *     // ... render multi-select UI
 *   )}
 * </SelectCore>
 * ```
 */
export function SelectCore<T>({
  children,
  value: valueProp,
  defaultValue,
  onChange,
  multiSelect = false,
  disabled = false,
  onOpen,
  onClose,
  onPressIn,
  onPressOut,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  accessibilityLabel,
  accessibilityHint,
  compareValues = (a, b) => a === b,
}: SelectCoreProps<T>): React.ReactElement | null {
  const [isOpen, setIsOpen] = React.useState(false);

  const { value: selectedValue, setValue: setSelectedValue } = useControllable<T | T[] | undefined>({
    value: valueProp,
    defaultValue,
    onChange,
  });

  // Open/close handlers
  const open = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    onOpen?.();
  }, [disabled, onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Selection helpers
  const isSelected = useCallback((value: T): boolean => {
    if (selectedValue === undefined) return false;

    if (multiSelect && Array.isArray(selectedValue)) {
      return selectedValue.some(v => compareValues(v, value));
    }

    return compareValues(selectedValue as T, value);
  }, [selectedValue, multiSelect, compareValues]);

  const select = useCallback((value: T) => {
    if (disabled) return;

    if (multiSelect) {
      const currentArray = Array.isArray(selectedValue) ? selectedValue : [];
      if (!isSelected(value)) {
        setSelectedValue([...currentArray, value] as T[]);
      }
    } else {
      setSelectedValue(value);
    }
  }, [disabled, multiSelect, selectedValue, isSelected, setSelectedValue]);

  const deselect = useCallback((value: T) => {
    if (disabled || !multiSelect) return;

    const currentArray = Array.isArray(selectedValue) ? selectedValue : [];
    setSelectedValue(currentArray.filter(v => !compareValues(v, value)) as T[]);
  }, [disabled, multiSelect, selectedValue, compareValues, setSelectedValue]);

  const clear = useCallback(() => {
    if (disabled) return;
    setSelectedValue(multiSelect ? [] : undefined);
  }, [disabled, multiSelect, setSelectedValue]);

  // Interaction hooks for trigger
  const { pressed, pressHandlers } = usePressable({
    disabled,
    onPress: toggleDropdown,
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

  const state: SelectCoreState<T> = {
    pressed,
    hovered,
    focused,
    selectedValue,
    isOpen,
    multiSelect,
  };

  const triggerHandlers: SelectCoreTriggerHandlers = {
    ...pressHandlers,
    ...hoverHandlers,
    ...focusHandlers,
  };

  const accessibilityProps: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'combobox',
    accessibilityState: {
      disabled,
      selected: selectedValue !== undefined,
    },
    accessibilityLabel,
    accessibilityHint,
  };

  return children({
    state,
    disabled,
    triggerHandlers,
    accessibilityProps,
    open,
    close,
    toggle: toggleDropdown,
    select,
    deselect,
    clear,
    isSelected,
  });
}

SelectCore.displayName = 'SelectCore';
