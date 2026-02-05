/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React, { useState, useCallback, useMemo, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  Frame,
  MeasureElement,
  MeasuringElement,
  Point,
  RenderFCProp,
} from '../../devsupport';
import { ModalService } from '../../theme';
import { Modal, ModalProps, RNModalProps } from '../modal/modal.component';
import {
  PopoverView,
  PopoverViewElement,
  PopoverViewProps,
} from './popoverView.component';
import { PopoverPlacementService } from './placement.service';
import {
  PlacementOptions,
  PopoverPlacement,
  PopoverPlacements,
} from './type';

type PopoverModalProps = Omit<ModalProps, 'children'>;

export interface PopoverProps extends PopoverViewProps, PopoverModalProps, RNModalProps {
  children?: React.ReactElement;
  placement?: PopoverPlacement | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anchor: RenderFCProp<any>;
  fullWidth?: boolean;
}

export type PopoverElement = React.ReactElement<PopoverProps>;

/**
 * Displays a content positioned relative to another view.
 *
 * @extends React.Component
 *
 * @property {boolean} visible - Whether content component is visible.
 * Defaults to false.
 * The property is more specific that the show/hide methods, so do not use them at the same time.
 *
 * @property {() => ReactElement} anchor - A component relative to which content component will be shown.
 *
 * @property {ReactElement} children - A component displayed within the popover.
 *
 * @property {() => void} onBackdropPress - Called when popover is visible and the underlying view was touched.
 * Useful when needed to close the modal on outside touches.
 *
 * @property {boolean} fullWidth - Whether a content component should take the width of `anchor`.
 *
 * @property {string | PopoverPlacement} placement - Position of the content component relative to the `anchor`.
 * Can be `left`, `top`, `right`, `bottom`, `left start`, `left end`, `top start`, `top end`, `right start`,
 * `right end`, `bottom start`, `bottom end`, `inner`, `inner top` or `inner bottom`.
 * Defaults to *bottom*.
 *
 * @property {boolean} hardwareAccelerated - Controls whether to force hardware acceleration for the underlying window.
 * Defaults to false.
 *
 * @property {'none' | 'slide' | 'fade'} animationType - Controls how the modal animates.
 * Defaults to 'none'.
 *
 * @property {Array<'portrait' | 'portrait-upside-down' | 'landscape' | 'landscape-left' | 'landscape-right'>}
 * supportedOrientations -
 * Allows the modal to be rotated to any of the specified orientations.
 * On iOS, the modal is still restricted by what's specified
 * in your app's Info.plist's UISupportedInterfaceOrientations field
 *
 * @property {StyleProp<ViewStyle>} backdropStyle - Style of backdrop.
 *
 * @property {(event: NativeSyntheticEvent<any>) => void} onShow -
 * Allows passing a function that will be called once the modal has been shown.
 *
 * @property {ViewProps} ...ViewProps - Any props applied to View component.
 *
 * @overview-example PopoverSimpleUsage
 * Popover accepts it's content as child element and is displayed relative to `anchor` view.
 *
 * @overview-example PopoverPlacement
 * By default, it is displayed to the bottom of `anchor` view, but it is configurable with `placement` property.
 *
 * @overview-example PopoverFullWidth
 * Popover may take the full width of the anchor view by configuring `fullWidth` property.
 *
 * @overview-example PopoverStyledBackdrop
 * To style the underlying view, `backdropStyle` property may be used.
 */
export const Popover = forwardRef<View, PopoverProps>(({
  children,
  placement = PopoverPlacements.BOTTOM,
  anchor,
  fullWidth = false,
  visible = false,
  backdropStyle,
  animationType,
  hardwareAccelerated,
  supportedOrientations,
  onShow,
  onBackdropPress,
  contentContainerStyle,
  ...viewProps
}, ref) => {
  // State - mirrors the original class state exactly
  const [childFrame, setChildFrame] = useState<Frame>(Frame.zero());
  const [forceMeasure, setForceMeasure] = useState<boolean>(false);
  const [actualPlacement, setActualPlacement] = useState<PopoverPlacement>(() =>
    PopoverPlacements.parse(placement)
  );
  const [contentPosition, setContentPosition] = useState<Point>(Point.zero());

  // Refs for values needed in callbacks without causing re-renders
  // React 2026: Using refs to avoid stale closures in callbacks
  const childFrameRef = useRef<Frame>(childFrame);
  const contentPositionRef = useRef<Point>(contentPosition);
  const actualPlacementRef = useRef<PopoverPlacement>(actualPlacement);
  const containerRef = useRef<View>(null);

  // Keep refs in sync with state
  childFrameRef.current = childFrame;
  contentPositionRef.current = contentPosition;
  actualPlacementRef.current = actualPlacement;

  // Forward ref to the container View
  useImperativeHandle(ref, () => containerRef.current as View, []);

  // Service instance - stable across renders (React 2026: lazy initialization)
  const placementService = useRef(new PopoverPlacementService()).current;

  // Computed value - equivalent to the class getter
  const preferredPlacement = useMemo(
    () => PopoverPlacements.parse(placement),
    [placement]
  );

  // Equivalent to componentDidUpdate
  // When visible becomes true and forceMeasure is false, trigger measurement
  useEffect(() => {
    if (visible && !forceMeasure) {
      setForceMeasure(true);
    }
  }, [visible, forceMeasure]);

  // Equivalent to getDerivedStateFromProps
  // When becoming invisible, reset position to offscreen
  useEffect(() => {
    if (!visible && !Point.outscreen().equals(contentPositionRef.current)) {
      setContentPosition(Point.outscreen());
    }
  }, [visible]);

  // Computed style for positioning
  const contentFlexPosition = useMemo((): StyleProp<ViewStyle> => {
    const { x: left, y: top } = contentPosition;
    return { left, top };
  }, [contentPosition]);

  // Callback when anchor element is measured
  const onChildMeasure = useCallback((frame: Frame): void => {
    if (!frame.equals(childFrameRef.current)) {
      setChildFrame(frame);
    }
  }, []);

  // Helper to calculate placement options
  const findPlacementOptions = useCallback(
    (contentFrame: Frame, anchorFrame: Frame): PlacementOptions => {
      const width = fullWidth ? anchorFrame.size.width : contentFrame.size.width;
      const frame = new Frame(
        contentFrame.origin.x,
        contentFrame.origin.y,
        width,
        contentFrame.size.height
      );
      return new PlacementOptions(frame, anchorFrame, Frame.window(), Frame.zero());
    },
    [fullWidth]
  );

  // Callback when popover content is measured
  const onContentMeasure = useCallback(
    (anchorFrame: Frame): void => {
      const placementOptions = findPlacementOptions(anchorFrame, childFrameRef.current);
      const computedPlacement = placementService.find(preferredPlacement, placementOptions);

      const displayFrame = computedPlacement.frame(placementOptions);
      const newContentPosition = displayFrame.origin;

      if (
        !newContentPosition.equals(contentPositionRef.current) ||
        computedPlacement.rawValue !== actualPlacementRef.current.rawValue
      ) {
        setActualPlacement(computedPlacement);
        setContentPosition(newContentPosition);
      }
    },
    [findPlacementOptions, placementService, preferredPlacement]
  );

  // Render helpers - React 2026: plain functions are fine, React Compiler optimizes these
  const renderContentElement = (): React.ReactElement => {
    const contentElement = children as React.ReactElement;
    const fullWidthStyle = { width: childFrame.size.width };

    return React.cloneElement(contentElement, {
      style: [fullWidth && fullWidthStyle, contentElement.props.style],
    });
  };

  const renderPopoverElement = (): PopoverViewElement => {
    return (
      <PopoverView
        {...viewProps}
        contentContainerStyle={[contentContainerStyle, styles.popoverView, contentFlexPosition]}
        layoutDirection={PopoverPlacements.parse(actualPlacement).flex()}
      >
        {renderContentElement()}
      </PopoverView>
    );
  };

  const renderMeasuringPopoverElement = (): MeasuringElement => {
    return (
      <MeasureElement onMeasure={onContentMeasure}>
        {renderPopoverElement()}
      </MeasureElement>
    );
  };

  return (
    <View ref={containerRef}>
      <MeasureElement
        force={forceMeasure}
        shouldUseTopInsets={ModalService.getShouldUseTopInsets}
        onMeasure={onChildMeasure}
      >
        {anchor()}
      </MeasureElement>
      <Modal
        visible={visible}
        shouldUseContainer={false}
        backdropStyle={backdropStyle}
        animationType={animationType}
        hardwareAccelerated={hardwareAccelerated}
        supportedOrientations={supportedOrientations}
        onShow={onShow}
        onBackdropPress={onBackdropPress}
      >
        {renderMeasuringPopoverElement()}
      </Modal>
    </View>
  );
});

// Display name for debugging
Popover.displayName = 'Popover';

const styles = StyleSheet.create({
  popoverView: {
    position: 'absolute',
  },
});
