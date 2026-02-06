/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import type { AccessibilityRole, AccessibilityState } from 'react-native';

/**
 * Represents the current interaction state of a component.
 * Used by headless components to communicate state to render props.
 */
export interface InteractionState {
  /** Whether the component is currently being pressed */
  pressed: boolean;
  /** Whether the component is being hovered (web/desktop only) */
  hovered: boolean;
  /** Whether the component has keyboard focus */
  focused: boolean;
}

/**
 * Accessibility props following React Native's accessibility API.
 * These should be spread onto the rendered touchable component.
 */
export interface AccessibilityProps {
  /** Whether the component is accessible */
  accessible?: boolean;
  /** The accessibility role (button, checkbox, etc.) */
  accessibilityRole?: AccessibilityRole;
  /** Current accessibility state */
  accessibilityState?: AccessibilityState;
  /** Human-readable label for screen readers */
  accessibilityLabel?: string;
  /** Hint describing what happens when interacting */
  accessibilityHint?: string;
}

/**
 * Base props for all core components.
 */
export interface CoreComponentProps {
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint for screen readers */
  accessibilityHint?: string;
}

/**
 * Props for components that support checked state.
 */
export interface CheckableProps {
  /** Whether the component is checked (controlled) */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Called when checked state changes */
  onChange?: (checked: boolean) => void;
}

/**
 * Props for components that support indeterminate state.
 */
export interface IndeterminateProps {
  /** Whether the component is in indeterminate state */
  indeterminate?: boolean;
}

/**
 * Props for text input components.
 */
export interface InputValueProps {
  /** Current value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Called when value changes */
  onChangeText?: (text: string) => void;
}

/**
 * Render props pattern - child function receives these props.
 */
export type RenderPropsChildren<T> = (props: T) => React.ReactElement | null;

/**
 * Generic handler type for events.
 */
export type EventHandler<T = void> = T extends void ? () => void : (event: T) => void;
