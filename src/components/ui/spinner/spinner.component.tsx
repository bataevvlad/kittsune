/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useRef, useEffect, useMemo } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {
  EvaSize,
  EvaStatus,
  Size,
  LiteralUnion,
} from '../../devsupport';
import { useStyled } from '../../theme';
import {
  SpinnerAnimation,
  SpinnerAnimationStyle,
} from './animation';

export interface SpinnerProps extends ViewProps {
  /**
   * Whether component is animating.
   * Default is *true*.
   */
  animating?: boolean;
  /**
   * Status of the component.
   * Can be `basic`, `primary`, `success`, `info`, `warning`, `danger` or `control`.
   * Defaults to *primary*.
   */
  status?: EvaStatus;
  /**
   * Size of the component.
   * Can be `tiny`, `small`, `medium`, `large`, or `giant`.
   * Defaults to *medium*.
   */
  size?: EvaSize;
  /**
   * Appearance of the component.
   * Defaults to *default*.
   */
  appearance?: LiteralUnion<'default'>;
}

export type SpinnerElement = React.ReactElement<SpinnerProps>;

interface ArcElementStyle {
  container: ViewStyle;
  arc: ViewStyle;
  overflow?: ViewStyle;
}

/**
 * Displays a loading state of a page or a section.
 *
 * @extends React.FC
 *
 * @property {boolean} animating - Whether component is animating.
 * Default is *true*.
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
 * @overview-example SpinnerSimpleUsage
 * Default Spinner status is `primary` and size is `medium`.
 *
 * @overview-example SpinnerSizes
 * To resize Spinner, a `size` property may be used.
 *
 * @overview-example SpinnerStatuses
 * A color can be changed with `status` property
 * An extra status is `control`, which is designed to be used on high-contrast backgrounds.
 *
 * @overview-example SpinnerTheming
 * Styling of Spinner is possible with [configuring a custom theme](guides/branding).
 *
 * @example SpinnerDataLoading
 */
export const Spinner: React.FC<SpinnerProps> = (props) => {
  const {
    animating = true,
    status,
    size,
    appearance,
    style,
    testID,
    ...viewProps
  } = props;

  const { style: evaStyle } = useStyled('Spinner', {
    appearance,
    status,
    size,
  });

  // Get container size from eva style
  const containerSize = useMemo(() => {
    const flatStyle = StyleSheet.flatten([evaStyle, style]);
    const width = (flatStyle?.width as number) || 0;
    const height = (flatStyle?.height as number) || 0;
    return new Size(width, height);
  }, [evaStyle, style]);

  // Create animation instance
  const animationRef = useRef<SpinnerAnimation | null>(null);

  // Initialize or update animation when size changes
  useEffect(() => {
    if (containerSize.height > 0) {
      animationRef.current = new SpinnerAnimation(containerSize.height);
    }
    return () => {
      animationRef.current?.release();
    };
  }, [containerSize.height]);

  // Handle animation start/stop
  useEffect(() => {
    if (animating && animationRef.current) {
      animationRef.current.start();
    } else if (!animating && animationRef.current) {
      animationRef.current.stop();
    }
  }, [animating]);

  const getComponentStyle = (source: SpinnerAnimationStyle): { start: ArcElementStyle; end: ArcElementStyle } => {
    const start: ArcElementStyle = {
      container: source.container,
      arc: source.start,
    };

    const end: ArcElementStyle = {
      container: source.container,
      arc: source.end,
      overflow: { top: containerSize.height / 2 },
    };

    return { start, end };
  };

  const renderArcElement = (arcStyle: ArcElementStyle, arcSize: Size): React.ReactElement<ViewProps> => {
    const halfSize: Size = new Size(arcSize.width, arcSize.height / 2);

    return (
      <Animated.View style={[StyleSheet.absoluteFill, arcStyle.container, arcSize]}>
        <View style={[styles.noOverflow, arcStyle.overflow, halfSize]}>
          <Animated.View style={[arcStyle.arc, arcSize]}>
            <View style={[styles.noOverflow, halfSize]}>
              <View style={[evaStyle, style]} />
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  // Don't render if animation not initialized yet
  if (!animationRef.current || containerSize.height === 0) {
    return <View testID={testID} style={containerSize} />;
  }

  const componentStyle = getComponentStyle(animationRef.current.toProps());

  return (
    <View testID={testID} style={containerSize} {...viewProps}>
      {renderArcElement(componentStyle.start, containerSize)}
      {renderArcElement(componentStyle.end, containerSize)}
    </View>
  );
};

Spinner.displayName = 'Spinner';

const styles = StyleSheet.create({
  noOverflow: {
    overflow: 'hidden',
  },
});
