/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { StyleType } from '@kitsuine/components';

export type PopoverIndicatorProps = ViewProps;
export type PopoverIndicatorElement = React.ReactElement<PopoverIndicatorProps>;

/**
 * Triangle indicator component for Popover.
 * Creates a triangle shape using CSS borders.
 */
export const PopoverIndicator: React.FC<PopoverIndicatorProps> = ({
  style,
  ...props
}) => {
  const componentStyle = useMemo((): StyleType => {
    const flatStyle: ViewStyle = StyleSheet.flatten(style);

    return {
      container: {
        // @ts-ignore: `width` is restricted to be a number
        borderLeftWidth: flatStyle.width,
        // @ts-ignore: `width` is restricted to be a number
        borderRightWidth: flatStyle.width,
        // @ts-ignore: `height` is restricted to be a number
        borderBottomWidth: flatStyle.height,
        borderBottomColor: flatStyle.backgroundColor,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        backgroundColor: 'transparent',
      },
    };
  }, [style]);

  return (
    <View
      {...props}
      style={[style, styles.container, componentStyle.container]}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});
