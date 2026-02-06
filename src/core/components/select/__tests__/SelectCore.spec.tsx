/**
 * @license
 * Copyright (c) 2024-2026 Vlad Bataev and Kittsune Contributors.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { SelectCore } from '../SelectCore';

describe('SelectCore', () => {
  describe('open/close state', () => {
    it('should start closed', () => {
      let currentState: any = null;

      render(
        <SelectCore>
          {({ state }) => {
            currentState = state;
            return <Text>Select</Text>;
          }}
        </SelectCore>,
      );

      expect(currentState.isOpen).toBe(false);
    });

    it('should toggle open state on press', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <SelectCore>
          {({ state, triggerHandlers }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="trigger" {...triggerHandlers}>
                <Text>Select</Text>
              </TouchableOpacity>
            );
          }}
        </SelectCore>,
      );

      expect(currentState.isOpen).toBe(false);

      fireEvent.press(getByTestId('trigger'));
      expect(currentState.isOpen).toBe(true);

      fireEvent.press(getByTestId('trigger'));
      expect(currentState.isOpen).toBe(false);
    });

    it('should call onOpen and onClose', () => {
      const onOpen = jest.fn();
      const onClose = jest.fn();

      const { getByTestId } = render(
        <SelectCore onOpen={onOpen} onClose={onClose}>
          {({ triggerHandlers }) => (
            <TouchableOpacity testID="trigger" {...triggerHandlers}>
              <Text>Select</Text>
            </TouchableOpacity>
          )}
        </SelectCore>,
      );

      fireEvent.press(getByTestId('trigger'));
      expect(onOpen).toHaveBeenCalledTimes(1);

      fireEvent.press(getByTestId('trigger'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should provide open, close, toggle functions', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <SelectCore>
          {({ state, open, close, toggle }) => {
            currentState = state;
            return (
              <View>
                <TouchableOpacity testID="open" onPress={open}>
                  <Text>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="close" onPress={close}>
                  <Text>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="toggle" onPress={toggle}>
                  <Text>Toggle</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </SelectCore>,
      );

      fireEvent.press(getByTestId('open'));
      expect(currentState.isOpen).toBe(true);

      fireEvent.press(getByTestId('close'));
      expect(currentState.isOpen).toBe(false);

      fireEvent.press(getByTestId('toggle'));
      expect(currentState.isOpen).toBe(true);
    });
  });

  describe('single select', () => {
    it('should select a value', () => {
      let currentState: any = null;
      const onChange = jest.fn();

      const { getByTestId } = render(
        <SelectCore onChange={onChange}>
          {({ state, select }) => {
            currentState = state;
            return (
              <View>
                <TouchableOpacity
                  testID="option-a"
                  onPress={() => select('a')}
                >
                  <Text>A</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </SelectCore>,
      );

      fireEvent.press(getByTestId('option-a'));

      expect(currentState.selectedValue).toBe('a');
      expect(onChange).toHaveBeenCalledWith('a');
    });

    it('should replace selection', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <SelectCore defaultValue="a">
          {({ state, select }) => {
            currentState = state;
            return (
              <View>
                <TouchableOpacity testID="option-b" onPress={() => select('b')}>
                  <Text>B</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </SelectCore>,
      );

      expect(currentState.selectedValue).toBe('a');

      fireEvent.press(getByTestId('option-b'));
      expect(currentState.selectedValue).toBe('b');
    });

    it('should check if value is selected', () => {
      let isASelected: boolean | undefined;
      let isBSelected: boolean | undefined;

      render(
        <SelectCore value="a">
          {({ isSelected }) => {
            isASelected = isSelected('a');
            isBSelected = isSelected('b');
            return <Text>Select</Text>;
          }}
        </SelectCore>,
      );

      expect(isASelected).toBe(true);
      expect(isBSelected).toBe(false);
    });

    it('should clear selection', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <SelectCore defaultValue="a">
          {({ state, clear }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="clear" onPress={clear}>
                <Text>Clear</Text>
              </TouchableOpacity>
            );
          }}
        </SelectCore>,
      );

      expect(currentState.selectedValue).toBe('a');

      fireEvent.press(getByTestId('clear'));
      expect(currentState.selectedValue).toBeUndefined();
    });
  });

  describe('multi select', () => {
    it('should support multiple selections', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <SelectCore multiSelect>
          {({ state, select }) => {
            currentState = state;
            return (
              <View>
                <TouchableOpacity testID="a" onPress={() => select('a')}>
                  <Text>A</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="b" onPress={() => select('b')}>
                  <Text>B</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </SelectCore>,
      );

      fireEvent.press(getByTestId('a'));
      expect(currentState.selectedValue).toEqual(['a']);

      fireEvent.press(getByTestId('b'));
      expect(currentState.selectedValue).toEqual(['a', 'b']);
    });

    it('should deselect values', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <SelectCore multiSelect defaultValue={['a', 'b']}>
          {({ state, deselect }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="deselect-a" onPress={() => deselect('a')}>
                <Text>Deselect A</Text>
              </TouchableOpacity>
            );
          }}
        </SelectCore>,
      );

      expect(currentState.selectedValue).toEqual(['a', 'b']);

      fireEvent.press(getByTestId('deselect-a'));
      expect(currentState.selectedValue).toEqual(['b']);
    });

    it('should clear all selections', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <SelectCore multiSelect defaultValue={['a', 'b', 'c']}>
          {({ state, clear }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="clear" onPress={clear}>
                <Text>Clear</Text>
              </TouchableOpacity>
            );
          }}
        </SelectCore>,
      );

      fireEvent.press(getByTestId('clear'));
      expect(currentState.selectedValue).toEqual([]);
    });

    it('should not add duplicate selections', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <SelectCore multiSelect defaultValue={['a']}>
          {({ state, select }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="a" onPress={() => select('a')}>
                <Text>A</Text>
              </TouchableOpacity>
            );
          }}
        </SelectCore>,
      );

      fireEvent.press(getByTestId('a'));
      expect(currentState.selectedValue).toEqual(['a']);
    });

    it('should check if value is selected in multi mode', () => {
      let isASelected: boolean | undefined;
      let isBSelected: boolean | undefined;

      render(
        <SelectCore multiSelect value={['a', 'c']}>
          {({ isSelected }) => {
            isASelected = isSelected('a');
            isBSelected = isSelected('b');
            return <Text>Select</Text>;
          }}
        </SelectCore>,
      );

      expect(isASelected).toBe(true);
      expect(isBSelected).toBe(false);
    });
  });

  describe('controlled mode', () => {
    it('should use provided value', () => {
      let currentState: any = null;

      render(
        <SelectCore value="controlled">
          {({ state }) => {
            currentState = state;
            return <Text>Select</Text>;
          }}
        </SelectCore>,
      );

      expect(currentState.selectedValue).toBe('controlled');
    });

    it('should update when controlled value changes', () => {
      const ControlledSelect = () => {
        const [value, setValue] = useState<string>('a');
        return (
          <View>
            <TouchableOpacity testID="change" onPress={() => setValue('b')}>
              <Text>Change</Text>
            </TouchableOpacity>
            <SelectCore value={value}>
              {({ state }) => (
                <Text testID="value">{state.selectedValue as string}</Text>
              )}
            </SelectCore>
          </View>
        );
      };

      const { getByTestId } = render(<ControlledSelect />);

      expect(getByTestId('value').props.children).toBe('a');

      fireEvent.press(getByTestId('change'));
      expect(getByTestId('value').props.children).toBe('b');
    });
  });

  describe('disabled state', () => {
    it('should not open when disabled', () => {
      let currentState: any = null;

      const { getByTestId } = render(
        <SelectCore disabled>
          {({ state, triggerHandlers }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="trigger" {...triggerHandlers}>
                <Text>Select</Text>
              </TouchableOpacity>
            );
          }}
        </SelectCore>,
      );

      fireEvent.press(getByTestId('trigger'));
      expect(currentState.isOpen).toBe(false);
    });

    it('should not select when disabled', () => {
      const onChange = jest.fn();

      const { getByTestId } = render(
        <SelectCore disabled onChange={onChange}>
          {({ select }) => (
            <TouchableOpacity testID="option" onPress={() => select('a')}>
              <Text>A</Text>
            </TouchableOpacity>
          )}
        </SelectCore>,
      );

      fireEvent.press(getByTestId('option'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have combobox role', () => {
      const { getByTestId } = render(
        <SelectCore>
          {({ accessibilityProps }) => (
            <TouchableOpacity testID="trigger" {...accessibilityProps}>
              <Text>Select</Text>
            </TouchableOpacity>
          )}
        </SelectCore>,
      );

      expect(getByTestId('trigger').props.accessibilityRole).toBe('combobox');
    });
  });

  describe('custom comparison', () => {
    it('should use custom compareValues function', () => {
      interface Option {
        id: number;
        label: string;
      }

      let isSelected: boolean | undefined;

      render(
        <SelectCore<Option>
          value={{ id: 1, label: 'Option 1' }}
          compareValues={(a, b) => a.id === b.id}
        >
          {(props) => {
            isSelected = props.isSelected({ id: 1, label: 'Different Label' });
            return <Text>Select</Text>;
          }}
        </SelectCore>,
      );

      expect(isSelected).toBe(true);
    });
  });
});
