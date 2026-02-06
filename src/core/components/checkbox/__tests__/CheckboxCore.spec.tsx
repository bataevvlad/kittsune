/**
 * @license
 * Copyright (c) 2024-2026 Vlad Bataev and Kittsune Contributors.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { CheckboxCore } from '../CheckboxCore';

describe('CheckboxCore', () => {
  describe('uncontrolled mode', () => {
    it('should start with defaultChecked value', () => {
      let currentState: any = null;

      render(
        <CheckboxCore defaultChecked={true}>
          {({ state, handlers }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="checkbox" {...handlers}>
                <Text>Checkbox</Text>
              </TouchableOpacity>
            );
          }}
        </CheckboxCore>,
      );

      expect(currentState.checked).toBe(true);
    });

    it('should toggle checked state on press', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <CheckboxCore defaultChecked={false}>
          {({ state, handlers }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="checkbox" {...handlers}>
                <Text>Checkbox</Text>
              </TouchableOpacity>
            );
          }}
        </CheckboxCore>,
      );

      expect(currentState.checked).toBe(false);

      fireEvent.press(getByTestId('checkbox'));
      expect(currentState.checked).toBe(true);

      fireEvent.press(getByTestId('checkbox'));
      expect(currentState.checked).toBe(false);
    });

    it('should call onChange when toggled', () => {
      const onChange = jest.fn();

      const { getByTestId } = render(
        <CheckboxCore defaultChecked={false} onChange={onChange}>
          {({ handlers }) => (
            <TouchableOpacity testID="checkbox" {...handlers}>
              <Text>Checkbox</Text>
            </TouchableOpacity>
          )}
        </CheckboxCore>,
      );

      fireEvent.press(getByTestId('checkbox'));
      expect(onChange).toHaveBeenCalledWith(true);

      fireEvent.press(getByTestId('checkbox'));
      expect(onChange).toHaveBeenCalledWith(false);
    });
  });

  describe('controlled mode', () => {
    it('should use provided checked value', () => {
      let currentState: any = null;

      render(
        <CheckboxCore checked={true}>
          {({ state, handlers }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="checkbox" {...handlers}>
                <Text>Checkbox</Text>
              </TouchableOpacity>
            );
          }}
        </CheckboxCore>,
      );

      expect(currentState.checked).toBe(true);
    });

    it('should update when controlled value changes', () => {
      const ControlledCheckbox = () => {
        const [checked, setChecked] = useState(false);
        return (
          <View>
            <TouchableOpacity
              testID="toggle"
              onPress={() => setChecked(!checked)}
            >
              <Text>Toggle</Text>
            </TouchableOpacity>
            <CheckboxCore checked={checked}>
              {({ state }) => (
                <Text testID="state">{state.checked ? 'checked' : 'unchecked'}</Text>
              )}
            </CheckboxCore>
          </View>
        );
      };

      const { getByTestId } = render(<ControlledCheckbox />);

      expect(getByTestId('state').props.children).toBe('unchecked');

      fireEvent.press(getByTestId('toggle'));
      expect(getByTestId('state').props.children).toBe('checked');
    });
  });

  describe('indeterminate state', () => {
    it('should expose indeterminate state', () => {
      let currentState: any = null;

      render(
        <CheckboxCore indeterminate={true}>
          {({ state, handlers }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="checkbox" {...handlers}>
                <Text>Checkbox</Text>
              </TouchableOpacity>
            );
          }}
        </CheckboxCore>,
      );

      expect(currentState.indeterminate).toBe(true);
    });

    it('should set checked to true when indeterminate is pressed', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <CheckboxCore defaultChecked={false} indeterminate={true}>
          {({ state, handlers }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="checkbox" {...handlers}>
                <Text>Checkbox</Text>
              </TouchableOpacity>
            );
          }}
        </CheckboxCore>,
      );

      fireEvent.press(getByTestId('checkbox'));
      expect(currentState.checked).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have checkbox role', () => {
      const { getByTestId } = render(
        <CheckboxCore>
          {({ accessibilityProps }) => (
            <TouchableOpacity testID="checkbox" {...accessibilityProps}>
              <Text>Checkbox</Text>
            </TouchableOpacity>
          )}
        </CheckboxCore>,
      );

      expect(getByTestId('checkbox').props.accessibilityRole).toBe('checkbox');
    });

    it('should set checked in accessibility state', () => {
      const { getByTestId, rerender } = render(
        <CheckboxCore checked={false}>
          {({ accessibilityProps }) => (
            <TouchableOpacity testID="checkbox" {...accessibilityProps}>
              <Text>Checkbox</Text>
            </TouchableOpacity>
          )}
        </CheckboxCore>,
      );

      expect(getByTestId('checkbox').props.accessibilityState.checked).toBe(false);

      rerender(
        <CheckboxCore checked={true}>
          {({ accessibilityProps }) => (
            <TouchableOpacity testID="checkbox" {...accessibilityProps}>
              <Text>Checkbox</Text>
            </TouchableOpacity>
          )}
        </CheckboxCore>,
      );

      expect(getByTestId('checkbox').props.accessibilityState.checked).toBe(true);
    });

    it('should set mixed when indeterminate', () => {
      const { getByTestId } = render(
        <CheckboxCore indeterminate={true}>
          {({ accessibilityProps }) => (
            <TouchableOpacity testID="checkbox" {...accessibilityProps}>
              <Text>Checkbox</Text>
            </TouchableOpacity>
          )}
        </CheckboxCore>,
      );

      expect(getByTestId('checkbox').props.accessibilityState.checked).toBe('mixed');
    });
  });

  describe('disabled state', () => {
    it('should not toggle when disabled', () => {
      const onChange = jest.fn();

      const { getByTestId } = render(
        <CheckboxCore disabled onChange={onChange}>
          {({ handlers }) => (
            <TouchableOpacity testID="checkbox" {...handlers}>
              <Text>Checkbox</Text>
            </TouchableOpacity>
          )}
        </CheckboxCore>,
      );

      fireEvent.press(getByTestId('checkbox'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('toggle function', () => {
    it('should provide toggle function', () => {
      let toggleFn: any = null;
      let currentState: any = null;

      const { getByTestId } = render(
        <CheckboxCore defaultChecked={false}>
          {({ state, toggle }) => {
            toggleFn = toggle;
            currentState = state;
            return (
              <TouchableOpacity testID="button" onPress={toggle}>
                <Text>Toggle</Text>
              </TouchableOpacity>
            );
          }}
        </CheckboxCore>,
      );

      expect(currentState.checked).toBe(false);

      fireEvent.press(getByTestId('button'));
      expect(currentState.checked).toBe(true);
    });
  });
});
