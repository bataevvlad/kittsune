/**
 * @license
 * Copyright (c) 2024-2026 Vlad Bataev and Kittsune Contributors.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { RadioCore } from '../RadioCore';
import { RadioGroupCore } from '../RadioGroupCore';

describe('RadioCore', () => {
  describe('standalone mode', () => {
    it('should render with selected state', () => {
      let currentState: any = null;

      render(
        <RadioCore value="a" selected={true}>
          {({ state, handlers }) => {
            currentState = state;
            return (
              <TouchableOpacity testID="radio" {...handlers}>
                <Text>Radio</Text>
              </TouchableOpacity>
            );
          }}
        </RadioCore>,
      );

      expect(currentState.selected).toBe(true);
    });

    it('should call onSelect when pressed', () => {
      const onSelect = jest.fn();

      const { getByTestId } = render(
        <RadioCore value="a" selected={false} onSelect={onSelect}>
          {({ handlers }) => (
            <TouchableOpacity testID="radio" {...handlers}>
              <Text>Radio</Text>
            </TouchableOpacity>
          )}
        </RadioCore>,
      );

      fireEvent.press(getByTestId('radio'));
      expect(onSelect).toHaveBeenCalledWith('a');
    });

    it('should not call onSelect when disabled', () => {
      const onSelect = jest.fn();

      const { getByTestId } = render(
        <RadioCore value="a" selected={false} onSelect={onSelect} disabled>
          {({ handlers }) => (
            <TouchableOpacity testID="radio" {...handlers}>
              <Text>Radio</Text>
            </TouchableOpacity>
          )}
        </RadioCore>,
      );

      fireEvent.press(getByTestId('radio'));
      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('with RadioGroupCore', () => {
    it('should inherit selection from group', () => {
      let stateA: any = null;
      let stateB: any = null;

      render(
        <RadioGroupCore value="b">
          <RadioCore value="a">
            {({ state }) => {
              stateA = state;
              return <Text>A</Text>;
            }}
          </RadioCore>
          <RadioCore value="b">
            {({ state }) => {
              stateB = state;
              return <Text>B</Text>;
            }}
          </RadioCore>
        </RadioGroupCore>,
      );

      expect(stateA.selected).toBe(false);
      expect(stateB.selected).toBe(true);
    });

    it('should update group on radio press', () => {
      const onChange = jest.fn();

      const { getByTestId } = render(
        <RadioGroupCore value="a" onChange={onChange}>
          <RadioCore value="a">
            {({ handlers }) => (
              <TouchableOpacity testID="radio-a" {...handlers}>
                <Text>A</Text>
              </TouchableOpacity>
            )}
          </RadioCore>
          <RadioCore value="b">
            {({ handlers }) => (
              <TouchableOpacity testID="radio-b" {...handlers}>
                <Text>B</Text>
              </TouchableOpacity>
            )}
          </RadioCore>
        </RadioGroupCore>,
      );

      fireEvent.press(getByTestId('radio-b'));
      expect(onChange).toHaveBeenCalledWith('b');
    });

    it('should respect group disabled state', () => {
      const onChange = jest.fn();

      const { getByTestId } = render(
        <RadioGroupCore value="a" onChange={onChange} disabled>
          <RadioCore value="a">
            {({ handlers }) => (
              <TouchableOpacity testID="radio-a" {...handlers}>
                <Text>A</Text>
              </TouchableOpacity>
            )}
          </RadioCore>
          <RadioCore value="b">
            {({ handlers }) => (
              <TouchableOpacity testID="radio-b" {...handlers}>
                <Text>B</Text>
              </TouchableOpacity>
            )}
          </RadioCore>
        </RadioGroupCore>,
      );

      fireEvent.press(getByTestId('radio-b'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have radio role', () => {
      const { getByTestId } = render(
        <RadioCore value="a" selected={false}>
          {({ accessibilityProps }) => (
            <TouchableOpacity testID="radio" {...accessibilityProps}>
              <Text>Radio</Text>
            </TouchableOpacity>
          )}
        </RadioCore>,
      );

      expect(getByTestId('radio').props.accessibilityRole).toBe('radio');
    });

    it('should set selected in accessibility state', () => {
      const { getByTestId, rerender } = render(
        <RadioCore value="a" selected={false}>
          {({ accessibilityProps }) => (
            <TouchableOpacity testID="radio" {...accessibilityProps}>
              <Text>Radio</Text>
            </TouchableOpacity>
          )}
        </RadioCore>,
      );

      expect(getByTestId('radio').props.accessibilityState.selected).toBe(false);
      expect(getByTestId('radio').props.accessibilityState.checked).toBe(false);

      rerender(
        <RadioCore value="a" selected={true}>
          {({ accessibilityProps }) => (
            <TouchableOpacity testID="radio" {...accessibilityProps}>
              <Text>Radio</Text>
            </TouchableOpacity>
          )}
        </RadioCore>,
      );

      expect(getByTestId('radio').props.accessibilityState.selected).toBe(true);
      expect(getByTestId('radio').props.accessibilityState.checked).toBe(true);
    });
  });

  describe('select function', () => {
    it('should provide select function', () => {
      const onSelect = jest.fn();

      const { getByTestId } = render(
        <RadioCore value="test" selected={false} onSelect={onSelect}>
          {({ select }) => (
            <TouchableOpacity testID="button" onPress={select}>
              <Text>Select</Text>
            </TouchableOpacity>
          )}
        </RadioCore>,
      );

      fireEvent.press(getByTestId('button'));
      expect(onSelect).toHaveBeenCalledWith('test');
    });
  });
});

describe('RadioGroupCore', () => {
  describe('uncontrolled mode', () => {
    it('should use defaultValue', () => {
      let stateA: any = null;
      let stateB: any = null;

      render(
        <RadioGroupCore defaultValue="b">
          <RadioCore value="a">
            {({ state }) => {
              stateA = state;
              return <Text>A</Text>;
            }}
          </RadioCore>
          <RadioCore value="b">
            {({ state }) => {
              stateB = state;
              return <Text>B</Text>;
            }}
          </RadioCore>
        </RadioGroupCore>,
      );

      expect(stateA.selected).toBe(false);
      expect(stateB.selected).toBe(true);
    });

    it('should update selection on press', () => {
      let stateA: any = null;
      let stateB: any = null;

      const { getByTestId } = render(
        <RadioGroupCore defaultValue="a">
          <RadioCore value="a">
            {({ state, handlers }) => {
              stateA = state;
              return (
                <TouchableOpacity testID="radio-a" {...handlers}>
                  <Text>A</Text>
                </TouchableOpacity>
              );
            }}
          </RadioCore>
          <RadioCore value="b">
            {({ state, handlers }) => {
              stateB = state;
              return (
                <TouchableOpacity testID="radio-b" {...handlers}>
                  <Text>B</Text>
                </TouchableOpacity>
              );
            }}
          </RadioCore>
        </RadioGroupCore>,
      );

      expect(stateA.selected).toBe(true);
      expect(stateB.selected).toBe(false);

      fireEvent.press(getByTestId('radio-b'));

      expect(stateA.selected).toBe(false);
      expect(stateB.selected).toBe(true);
    });
  });

  describe('render props', () => {
    it('should support render props pattern', () => {
      const { getByTestId } = render(
        <RadioGroupCore value="a">
          {({ value, accessibilityProps }) => (
            <View testID="container" {...accessibilityProps}>
              <Text testID="value">{value as string}</Text>
            </View>
          )}
        </RadioGroupCore>,
      );

      expect(getByTestId('value').props.children).toBe('a');
      expect(getByTestId('container').props.accessibilityRole).toBe('radiogroup');
    });
  });
});
