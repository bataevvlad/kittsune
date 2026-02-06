/**
 * @license
 * Copyright (c) 2024-2026 Vlad Bataev and Kittsune Contributors.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useRef, useState } from 'react';
import { TextInput, View, TouchableOpacity, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { InputCore, InputCoreRef } from '../InputCore';

describe('InputCore', () => {
  describe('uncontrolled mode', () => {
    it('should start with defaultValue', () => {
      let currentState: any = null;

      render(
        <InputCore defaultValue="initial">
          {({ state, inputProps, inputRef }) => {
            currentState = state;
            return <TextInput testID="input" ref={inputRef} {...inputProps} />;
          }}
        </InputCore>,
      );

      expect(currentState.value).toBe('initial');
    });

    it('should update value on change', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <InputCore defaultValue="">
          {({ state, inputProps, inputRef }) => {
            currentState = state;
            return <TextInput testID="input" ref={inputRef} {...inputProps} />;
          }}
        </InputCore>,
      );

      fireEvent.changeText(getByTestId('input'), 'new text');
      expect(currentState.value).toBe('new text');
    });

    it('should call onChangeText', () => {
      const onChangeText = jest.fn();

      const { getByTestId } = render(
        <InputCore defaultValue="" onChangeText={onChangeText}>
          {({ inputProps, inputRef }) => (
            <TextInput testID="input" ref={inputRef} {...inputProps} />
          )}
        </InputCore>,
      );

      fireEvent.changeText(getByTestId('input'), 'hello');
      expect(onChangeText).toHaveBeenCalledWith('hello');
    });
  });

  describe('controlled mode', () => {
    it('should use provided value', () => {
      let currentState: any = null;

      render(
        <InputCore value="controlled">
          {({ state, inputProps, inputRef }) => {
            currentState = state;
            return <TextInput testID="input" ref={inputRef} {...inputProps} />;
          }}
        </InputCore>,
      );

      expect(currentState.value).toBe('controlled');
    });

    it('should update when controlled value changes', () => {
      const ControlledInput = () => {
        const [value, setValue] = useState('initial');
        return (
          <View>
            <TouchableOpacity
              testID="update"
              onPress={() => setValue('updated')}
            >
              <Text>Update</Text>
            </TouchableOpacity>
            <InputCore value={value}>
              {({ state }) => <Text testID="value">{state.value}</Text>}
            </InputCore>
          </View>
        );
      };

      const { getByTestId } = render(<ControlledInput />);

      expect(getByTestId('value').props.children).toBe('initial');

      fireEvent.press(getByTestId('update'));
      expect(getByTestId('value').props.children).toBe('updated');
    });
  });

  describe('state properties', () => {
    it('should report isEmpty correctly', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <InputCore defaultValue="">
          {({ state, inputProps, inputRef }) => {
            currentState = state;
            return <TextInput testID="input" ref={inputRef} {...inputProps} />;
          }}
        </InputCore>,
      );

      expect(currentState.isEmpty).toBe(true);

      fireEvent.changeText(getByTestId('input'), 'text');
      expect(currentState.isEmpty).toBe(false);

      fireEvent.changeText(getByTestId('input'), '');
      expect(currentState.isEmpty).toBe(true);
    });

    it('should track focused state', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <InputCore defaultValue="">
          {({ state, inputProps, inputRef }) => {
            currentState = state;
            return <TextInput testID="input" ref={inputRef} {...inputProps} />;
          }}
        </InputCore>,
      );

      expect(currentState.focused).toBe(false);

      fireEvent(getByTestId('input'), 'focus');
      expect(currentState.focused).toBe(true);

      fireEvent(getByTestId('input'), 'blur');
      expect(currentState.focused).toBe(false);
    });
  });

  describe('callbacks', () => {
    it('should call onFocus', () => {
      const onFocus = jest.fn();

      const { getByTestId } = render(
        <InputCore defaultValue="" onFocus={onFocus}>
          {({ inputProps, inputRef }) => (
            <TextInput testID="input" ref={inputRef} {...inputProps} />
          )}
        </InputCore>,
      );

      fireEvent(getByTestId('input'), 'focus');
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur', () => {
      const onBlur = jest.fn();

      const { getByTestId } = render(
        <InputCore defaultValue="" onBlur={onBlur}>
          {({ inputProps, inputRef }) => (
            <TextInput testID="input" ref={inputRef} {...inputProps} />
          )}
        </InputCore>,
      );

      fireEvent(getByTestId('input'), 'blur');
      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled state', () => {
    it('should set editable to false when disabled', () => {
      const { getByTestId } = render(
        <InputCore defaultValue="" disabled>
          {({ inputProps, inputRef }) => (
            <TextInput testID="input" ref={inputRef} {...inputProps} />
          )}
        </InputCore>,
      );

      expect(getByTestId('input').props.editable).toBe(false);
    });

    it('should set editable to true when not disabled', () => {
      const { getByTestId } = render(
        <InputCore defaultValue="" disabled={false}>
          {({ inputProps, inputRef }) => (
            <TextInput testID="input" ref={inputRef} {...inputProps} />
          )}
        </InputCore>,
      );

      expect(getByTestId('input').props.editable).toBe(true);
    });
  });

  describe('imperative methods', () => {
    it('should provide clear function', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <InputCore defaultValue="some text">
          {({ state, inputProps, inputRef, clear }) => {
            currentState = state;
            return (
              <View>
                <TextInput testID="input" ref={inputRef} {...inputProps} />
                <TouchableOpacity testID="clear" onPress={clear}>
                  <Text>Clear</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </InputCore>,
      );

      expect(currentState.value).toBe('some text');

      fireEvent.press(getByTestId('clear'));
      expect(currentState.value).toBe('');
    });
  });

  describe('accessibility', () => {
    it('should provide accessibility props', () => {
      const { getByTestId } = render(
        <InputCore
          defaultValue=""
          accessibilityLabel="Email input"
          accessibilityHint="Enter your email"
        >
          {({ accessibilityProps }) => (
            <View testID="container" {...accessibilityProps}>
              <TextInput />
            </View>
          )}
        </InputCore>,
      );

      const container = getByTestId('container');
      expect(container.props.accessible).toBe(true);
      expect(container.props.accessibilityLabel).toBe('Email input');
      expect(container.props.accessibilityHint).toBe('Enter your email');
    });

    it('should set disabled in accessibility state', () => {
      const { getByTestId } = render(
        <InputCore defaultValue="" disabled>
          {({ accessibilityProps }) => (
            <View testID="container" {...accessibilityProps}>
              <TextInput />
            </View>
          )}
        </InputCore>,
      );

      expect(getByTestId('container').props.accessibilityState).toEqual({
        disabled: true,
      });
    });
  });
});
