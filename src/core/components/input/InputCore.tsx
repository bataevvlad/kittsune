/**
 * @license
 * Copyright (c) 2024-2026 Vlad Bataev and Kittsune Contributors.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import type {
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TargetedEvent,
} from 'react-native';
import { useControllableString } from '../../hooks/useControllable';
import { useHoverable } from '../../hooks/useHoverable';
import { useFocusable } from '../../hooks/useFocusable';
import type { InteractionState, AccessibilityProps, RenderPropsChildren } from '../../types/common';

/**
 * Input-specific state extending InteractionState.
 */
export interface InputCoreState extends InteractionState {
  /** Current input value */
  value: string;
  /** Whether the input is empty */
  isEmpty: boolean;
}

/**
 * Methods exposed via ref.
 */
export interface InputCoreRef {
  /** Focus the input */
  focus: () => void;
  /** Blur the input */
  blur: () => void;
  /** Check if input is focused */
  isFocused: () => boolean;
  /** Clear the input value */
  clear: () => void;
}

/**
 * Props passed to InputCore's render function.
 */
export interface InputCoreRenderProps {
  /** Current input state */
  state: InputCoreState;
  /** Whether the input is disabled */
  disabled: boolean;
  /** Props to spread onto the TextInput */
  inputProps: InputCoreInputProps;
  /** Ref to attach to the TextInput */
  inputRef: React.RefObject<TextInput>;
  /** Accessibility props for the container */
  accessibilityProps: AccessibilityProps;
  /** Focus the input programmatically */
  focus: () => void;
  /** Blur the input programmatically */
  blur: () => void;
  /** Clear the input value */
  clear: () => void;
}

/**
 * Props to spread onto the TextInput component.
 */
export interface InputCoreInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  editable: boolean;
  onMouseEnter?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  onMouseLeave?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
}

/**
 * Props for InputCore component.
 */
export interface InputCoreProps {
  /** Render function receiving state and handlers */
  children: RenderPropsChildren<InputCoreRenderProps>;
  /** Current value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Called when text changes */
  onChangeText?: (text: string) => void;
  /** Whether the input is disabled/non-editable */
  disabled?: boolean;
  /** Called when input is focused */
  onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  /** Called when input loses focus */
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  /** Callback when mouse enters (web) */
  onMouseEnter?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  /** Callback when mouse leaves (web) */
  onMouseLeave?: (event: NativeSyntheticEvent<TargetedEvent>) => void;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
}

/**
 * Headless input component that manages value and focus state.
 *
 * Provides controlled/uncontrolled value management and exposes
 * imperative methods via ref (focus, blur, clear).
 *
 * @example Basic controlled input
 * ```tsx
 * const [text, setText] = useState('');
 *
 * <InputCore value={text} onChangeText={setText}>
 *   {({ state, inputProps, inputRef }) => (
 *     <View style={{ borderColor: state.focused ? 'blue' : 'gray' }}>
 *       <TextInput ref={inputRef} {...inputProps} />
 *     </View>
 *   )}
 * </InputCore>
 * ```
 *
 * @example With ref for imperative control
 * ```tsx
 * const inputRef = useRef<InputCoreRef>(null);
 *
 * <InputCore ref={inputRef} defaultValue="">
 *   {({ inputProps, inputRef, clear }) => (
 *     <View>
 *       <TextInput ref={inputRef} {...inputProps} />
 *       <Button onPress={clear}>Clear</Button>
 *     </View>
 *   )}
 * </InputCore>
 * ```
 */
function InputCoreComponent(
  {
    children,
    value: valueProp,
    defaultValue = '',
    onChangeText,
    disabled = false,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    onMouseEnter,
    onMouseLeave,
    accessibilityLabel,
    accessibilityHint,
  }: InputCoreProps,
  ref: React.Ref<InputCoreRef>,
): React.ReactElement | null {
  const textInputRef = useRef<TextInput>(null);

  const { value, setValue } = useControllableString({
    value: valueProp,
    defaultValue,
    onChange: onChangeText,
  });

  const { hovered, hoverHandlers } = useHoverable({
    disabled,
    onMouseEnter,
    onMouseLeave,
  });

  const { focused, focusHandlers } = useFocusable({
    disabled,
    onFocus: onFocusProp as ((event: NativeSyntheticEvent<TargetedEvent>) => void) | undefined,
    onBlur: onBlurProp as ((event: NativeSyntheticEvent<TargetedEvent>) => void) | undefined,
  });

  // Imperative methods
  const focus = useCallback(() => {
    textInputRef.current?.focus();
  }, []);

  const blur = useCallback(() => {
    textInputRef.current?.blur();
  }, []);

  const isFocused = useCallback(() => {
    return textInputRef.current?.isFocused() ?? false;
  }, []);

  const clear = useCallback(() => {
    setValue('');
    textInputRef.current?.clear();
  }, [setValue]);

  // Expose ref methods
  useImperativeHandle(ref, () => ({
    focus,
    blur,
    isFocused,
    clear,
  }), [focus, blur, isFocused, clear]);

  const state: InputCoreState = {
    pressed: false, // Inputs don't have pressed state
    hovered,
    focused,
    value,
    isEmpty: value.length === 0,
  };

  const inputProps: InputCoreInputProps = {
    value,
    onChangeText: setValue,
    onFocus: focusHandlers.onFocus as (event: NativeSyntheticEvent<TextInputFocusEventData>) => void,
    onBlur: focusHandlers.onBlur as (event: NativeSyntheticEvent<TextInputFocusEventData>) => void,
    editable: !disabled,
    ...hoverHandlers,
  };

  const accessibilityProps: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'none', // TextInput has its own role
    accessibilityState: {
      disabled,
    },
    accessibilityLabel,
    accessibilityHint,
  };

  return children({
    state,
    disabled,
    inputProps,
    inputRef: textInputRef,
    accessibilityProps,
    focus,
    blur,
    clear,
  });
}

export const InputCore = forwardRef(InputCoreComponent);
InputCore.displayName = 'InputCore';
