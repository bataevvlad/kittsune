/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ToggleCore } from '../ToggleCore';

describe('ToggleCore', () => {
  describe('uncontrolled mode', () => {
    it('should start with defaultChecked value', () => {
      let currentState: any = null;

      render(
        <ToggleCore defaultChecked={true}>
          {({ state, handlers }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="toggle" {...handlers}>
                <Text>Toggle</Text>
              </TouchableOpacity>
            );
          }}
        </ToggleCore>,
      );

      expect(currentState.checked).toBe(true);
    });

    it('should toggle checked state on press', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <ToggleCore defaultChecked={false}>
          {({ state, handlers }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="toggle" {...handlers}>
                <Text>Toggle</Text>
              </TouchableOpacity>
            );
          }}
        </ToggleCore>,
      );

      expect(currentState.checked).toBe(false);

      fireEvent.press(getByTestId('toggle'));
      expect(currentState.checked).toBe(true);

      fireEvent.press(getByTestId('toggle'));
      expect(currentState.checked).toBe(false);
    });

    it('should call onChange when toggled', () => {
      const onChange = jest.fn();

      const { getByTestId } = render(
        <ToggleCore defaultChecked={false} onChange={onChange}>
          {({ handlers }) => (
            <TouchableOpacity testID="toggle" {...handlers}>
              <Text>Toggle</Text>
            </TouchableOpacity>
          )}
        </ToggleCore>,
      );

      fireEvent.press(getByTestId('toggle'));
      expect(onChange).toHaveBeenCalledWith(true);

      fireEvent.press(getByTestId('toggle'));
      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  describe('controlled mode', () => {
    it('should use provided checked value', () => {
      let currentState: any = null;

      render(
        <ToggleCore checked={true}>
          {({ state, handlers }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="toggle" {...handlers}>
                <Text>Toggle</Text>
              </TouchableOpacity>
            );
          }}
        </ToggleCore>,
      );

      expect(currentState.checked).toBe(true);
    });

    it('should update when controlled value changes', () => {
      const ControlledToggle = () => {
        const [checked, setChecked] = useState(false);
        return (
          <View>
            <TouchableOpacity
              testID="external-toggle"
              onPress={() => setChecked(!checked)}
            >
              <Text>External Toggle</Text>
            </TouchableOpacity>
            <ToggleCore checked={checked}>
              {({ state }) => (
                <Text testID="state">{state.checked ? 'on' : 'off'}</Text>
              )}
            </ToggleCore>
          </View>
        );
      };

      const { getByTestId } = render(<ControlledToggle />);

      expect(getByTestId('state').props.children).toBe('off');

      fireEvent.press(getByTestId('external-toggle'));
      expect(getByTestId('state').props.children).toBe('on');
    });
  });

  describe('accessibility', () => {
    it('should have switch role', () => {
      const { getByTestId } = render(
        <ToggleCore>
          {({ accessibilityProps }) => (
            <TouchableOpacity testID="toggle" {...accessibilityProps}>
              <Text>Toggle</Text>
            </TouchableOpacity>
          )}
        </ToggleCore>,
      );

      expect(getByTestId('toggle').props.accessibilityRole).toBe('switch');
    });

    it('should set checked in accessibility state', () => {
      const { getByTestId, rerender } = render(
        <ToggleCore checked={false}>
          {({ accessibilityProps }) => (
            <TouchableOpacity testID="toggle" {...accessibilityProps}>
              <Text>Toggle</Text>
            </TouchableOpacity>
          )}
        </ToggleCore>,
      );

      expect(getByTestId('toggle').props.accessibilityState.checked).toBe(false);

      rerender(
        <ToggleCore checked={true}>
          {({ accessibilityProps }) => (
            <TouchableOpacity testID="toggle" {...accessibilityProps}>
              <Text>Toggle</Text>
            </TouchableOpacity>
          )}
        </ToggleCore>,
      );

      expect(getByTestId('toggle').props.accessibilityState.checked).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('should not toggle when disabled', () => {
      const onChange = jest.fn();

      const { getByTestId } = render(
        <ToggleCore disabled onChange={onChange}>
          {({ handlers }) => (
            <TouchableOpacity testID="toggle" {...handlers}>
              <Text>Toggle</Text>
            </TouchableOpacity>
          )}
        </ToggleCore>,
      );

      fireEvent.press(getByTestId('toggle'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('helper functions', () => {
    it('should provide toggle function', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <ToggleCore defaultChecked={false}>
          {({ state, toggle }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="button" onPress={toggle}>
                <Text>Toggle</Text>
              </TouchableOpacity>
            );
          }}
        </ToggleCore>,
      );

      expect(currentState.checked).toBe(false);

      fireEvent.press(getByTestId('button'));
      expect(currentState.checked).toBe(true);
    });

    it('should provide turnOn function', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <ToggleCore defaultChecked={false}>
          {({ state, turnOn }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="button" onPress={turnOn}>
                <Text>Turn On</Text>
              </TouchableOpacity>
            );
          }}
        </ToggleCore>,
      );

      fireEvent.press(getByTestId('button'));
      expect(currentState.checked).toBe(true);

      // Should stay true if pressed again
      fireEvent.press(getByTestId('button'));
      expect(currentState.checked).toBe(true);
    });

    it('should provide turnOff function', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <ToggleCore defaultChecked={true}>
          {({ state, turnOff }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="button" onPress={turnOff}>
                <Text>Turn Off</Text>
              </TouchableOpacity>
            );
          }}
        </ToggleCore>,
      );

      fireEvent.press(getByTestId('button'));
      expect(currentState.checked).toBe(false);

      // Should stay false if pressed again
      fireEvent.press(getByTestId('button'));
      expect(currentState.checked).toBe(false);
    });
  });
});
