/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ButtonCore } from '../ButtonCore';

describe('ButtonCore', () => {
  it('should render with initial state', () => {
    const { getByTestId } = render(
      <ButtonCore>
        {({ state, handlers, accessibilityProps }) => (
          <TouchableOpacity
            testID="button"
            {...handlers}
            {...accessibilityProps}
          >
            <Text testID="text">
              {state.pressed ? 'Pressed' : 'Not Pressed'}
            </Text>
          </TouchableOpacity>
        )}
      </ButtonCore>,
    );

    expect(getByTestId('text').props.children).toBe('Not Pressed');
  });

  it('should update pressed state on press', () => {
    let currentState: any = null;

    const { getByTestId } = render(
      <ButtonCore>
        {({ state, handlers, accessibilityProps }) => {
          currentState = state;
          return (
            <TouchableOpacity
              testID="button"
              {...handlers}
              {...accessibilityProps}
            >
              <Text>Button</Text>
            </TouchableOpacity>
          );
        }}
      </ButtonCore>,
    );

    expect(currentState.pressed).toBe(false);

    fireEvent(getByTestId('button'), 'pressIn');
    expect(currentState.pressed).toBe(true);

    fireEvent(getByTestId('button'), 'pressOut');
    expect(currentState.pressed).toBe(false);
  });

  it('should call onPress callback', () => {
    const onPress = jest.fn();

    const { getByTestId } = render(
      <ButtonCore onPress={onPress}>
        {({ handlers, accessibilityProps }) => (
          <TouchableOpacity
            testID="button"
            {...handlers}
            {...accessibilityProps}
          >
            <Text>Button</Text>
          </TouchableOpacity>
        )}
      </ButtonCore>,
    );

    fireEvent.press(getByTestId('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn();

    const { getByTestId } = render(
      <ButtonCore onPress={onPress} disabled>
        {({ handlers, accessibilityProps }) => (
          <TouchableOpacity
            testID="button"
            {...handlers}
            {...accessibilityProps}
          >
            <Text>Button</Text>
          </TouchableOpacity>
        )}
      </ButtonCore>,
    );

    fireEvent.press(getByTestId('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should provide correct accessibility props', () => {
    const { getByTestId } = render(
      <ButtonCore
        accessibilityLabel="Test Button"
        accessibilityHint="Press me"
      >
        {({ handlers, accessibilityProps }) => (
          <TouchableOpacity
            testID="button"
            {...handlers}
            {...accessibilityProps}
          >
            <Text>Button</Text>
          </TouchableOpacity>
        )}
      </ButtonCore>,
    );

    const button = getByTestId('button');
    expect(button.props.accessible).toBe(true);
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityLabel).toBe('Test Button');
    expect(button.props.accessibilityHint).toBe('Press me');
    expect(button.props.accessibilityState).toEqual({ disabled: false });
  });

  it('should set disabled in accessibility state', () => {
    const { getByTestId } = render(
      <ButtonCore disabled>
        {({ handlers, accessibilityProps }) => (
          <TouchableOpacity
            testID="button"
            {...handlers}
            {...accessibilityProps}
          >
            <Text>Button</Text>
          </TouchableOpacity>
        )}
      </ButtonCore>,
    );

    const button = getByTestId('button');
    expect(button.props.accessibilityState).toEqual({ disabled: true });
  });

  it('should call focus and blur callbacks', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    const { getByTestId } = render(
      <ButtonCore onFocus={onFocus} onBlur={onBlur}>
        {({ handlers }) => (
          <TouchableOpacity testID="button" {...handlers}>
            <Text>Button</Text>
          </TouchableOpacity>
        )}
      </ButtonCore>,
    );

    fireEvent(getByTestId('button'), 'focus');
    expect(onFocus).toHaveBeenCalledTimes(1);

    fireEvent(getByTestId('button'), 'blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('should update focused state', () => {
    let currentState: any = null;

    const { getByTestId } = render(
      <ButtonCore>
        {({ state, handlers }) => {
          currentState = state;
          return (
            <TouchableOpacity testID="button" {...handlers}>
              <Text>Button</Text>
            </TouchableOpacity>
          );
        }}
      </ButtonCore>,
    );

    expect(currentState.focused).toBe(false);

    fireEvent(getByTestId('button'), 'focus');
    expect(currentState.focused).toBe(true);

    fireEvent(getByTestId('button'), 'blur');
    expect(currentState.focused).toBe(false);
  });
});
