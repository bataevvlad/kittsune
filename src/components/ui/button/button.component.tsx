/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Copyright (c) 2024-2026 Vlad Bataev and Kittsune Contributors.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React from 'react';
import {
  ImageProps,
  StyleSheet,
} from 'react-native';
import {
  ButtonCore,
  ButtonCoreRenderProps,
} from '@kittsune/core';
import {
  EvaSize,
  EvaStatus,
  FalsyFC,
  FalsyText,
  RenderProp,
  TouchableWeb,
  TouchableWebProps,
  LiteralUnion,
} from '../../devsupport';
import { useEvaStyle } from '../../theme';
import { TextProps } from '../text/text.component';

type TouchableWebPropsWithoutChildren = Omit<TouchableWebProps, 'children'>;

export interface ButtonProps extends TouchableWebPropsWithoutChildren {
  children?: RenderProp<TextProps> | React.ReactText;
  /**
   * Function component to render to start of the text.
   * Expected to return an Image.
   */
  accessoryLeft?: RenderProp<Partial<ImageProps>>;
  /**
   * Function component to render to end of the text.
   * Expected to return an Image.
   */
  accessoryRight?: RenderProp<Partial<ImageProps>>;
  /**
   * Appearance of the component.
   * Can be `filled`, `outline` or `ghost`.
   * Defaults to *filled*.
   */
  appearance?: LiteralUnion<'filled' | 'outline' | 'ghost'>;
  /**
   * Status of the component.
   * Can be `basic`, `primary`, `success`, `info`, `warning`, `danger` or `control`.
   * Defaults to *primary*.
   * Use *control* status when needed to display within a contrast container.
   */
  status?: EvaStatus;
  /**
   * Size of the component.
   * Can be `tiny`, `small`, `medium`, `large`, or `giant`.
   * Defaults to *medium*.
   */
  size?: EvaSize;
}

export type ButtonElement = React.ReactElement<ButtonProps>;

/**
 * Buttons allow users to take actions, and make choices, with a single tap.
 *
 * @extends React.FC
 *
 * @property {ReactElement | ReactText | (TextProps) => ReactElement} children - String, number or a function component
 * to render within the button.
 * If it is a function, expected to return a Text.
 *
 * @property {ReactElement | (ImageProps) => ReactElement} accessoryLeft - Function component
 * to render to start of the text.
 * Expected to return an Image.
 *
 * @property {ReactElement | (ImageProps) => ReactElement} accessoryRight - Function component
 * to render to end of the text.
 * Expected to return an Image.
 *
 * @property {string} appearance - Appearance of the component.
 * Can be `filled`, `outline` or `ghost`.
 * Defaults to *filled*.
 *
 * @property {string} status - Status of the component.
 * Can be `basic`, `primary`, `success`, `info`, `warning`, `danger` or `control`.
 * Defaults to *primary*.
 * Use *control* status when needed to display within a contrast container.
 *
 * @property {string} size - Size of the component.
 * Can be `tiny`, `small`, `medium`, `large`, or `giant`.
 * Defaults to *medium*.
 *
 * @property {TouchableOpacityProps} ...TouchableOpacityProps - Any props applied to TouchableOpacity component.
 *
 * @overview-example ButtonSimpleUsage
 * Default button size is `medium` and status color is `primary`.
 *
 * @overview-example ButtonStates
 * Button can be disabled with `disabled` property.
 *
 * @overview-example ButtonAppearances
 * Within Eva Design System, it can be `filled`, `outline` or `ghost`.
 *
 * @overview-example ButtonAccessories
 * Also, it may contain inner views configured with `accessoryLeft` and `accessoryRight` properties.
 * Within Eva it is expected to be an image or [svg icon](guides/icon-packages).
 *
 * @overview-example ButtonSize
 * Buttons can be resized by using `size` property.
 *
 * @overview-example ButtonStatus
 * Or marked with `status` property.
 * An extra status is `control`, which is designed to be used on high-contrast backgrounds.
 *
 * @overview-example ButtonOutline
 * Status can be combined with `outline` appearance.
 *
 * @overview-example ButtonGhost
 * As well as for `ghost`.
 *
 * @overview-example ButtonStyling
 * Button and it's inner views can be styled by passing them as function components.
 * ```
 * import { Button, Text } from '@kittsune/components';
 *
 * <Button style={...}>
 *   {evaProps => <Text {...evaProps}>BUTTON</Text>}
 * </Button>
 * ```
 *
 * @overview-example ButtonTheming
 * In most cases this is redundant, if [custom theme is configured](guides/branding).
 */
export const Button = React.forwardRef<TouchableWeb, ButtonProps>(
  (props, ref) => {
    const {
      appearance,
      status,
      size,
      style,
      children,
      accessoryLeft,
      accessoryRight,
      disabled = false,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      onPress,
      onPressIn,
      onPressOut,
      onLongPress,
      accessibilityLabel,
      accessibilityHint,
      ...touchableProps
    } = props;

    return (
      <ButtonCore
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onLongPress={onLongPress}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        {({ state, handlers, accessibilityProps }: ButtonCoreRenderProps) => {
          // Use the Eva style bridge hook
          const { styles: evaStyles } = useEvaStyle('Button', {
            appearance,
            status,
            size,
            states: {
              active: state.pressed,
              hover: state.hovered,
              focused: state.focused,
              disabled,
            },
          });

          return (
            <TouchableWeb
              ref={ref}
              {...touchableProps}
              {...handlers}
              {...accessibilityProps}
              disabled={disabled}
              style={[evaStyles.container, styles.container, style]}
            >
              <FalsyFC
                style={evaStyles.icon}
                component={accessoryLeft}
              />
              <FalsyText
                style={evaStyles.text}
                component={children}
              />
              <FalsyFC
                style={evaStyles.icon}
                component={accessoryRight}
              />
            </TouchableWeb>
          );
        }}
      </ButtonCore>
    );
  },
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
