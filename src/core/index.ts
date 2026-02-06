/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

// Types
export type {
  InteractionState,
  AccessibilityProps,
  CoreComponentProps,
  CheckableProps,
  IndeterminateProps,
  InputValueProps,
  RenderPropsChildren,
  EventHandler,
} from './types/common';

// Utils
export { mergeRefs, setRef } from './utils/mergeRefs';
export {
  isWeb,
  isIOS,
  isAndroid,
  supportsHover,
  supportsFocusVisible,
  platformSelect,
} from './utils/platform';

// Hooks
export {
  useControllable,
  useControllableBoolean,
  useControllableString,
} from './hooks/useControllable';
export { usePressable, usePressState } from './hooks/usePressable';
export { useHoverable, useHoverState } from './hooks/useHoverable';
export { useFocusable, useFocusState } from './hooks/useFocusable';

// Components
export {
  ButtonCore,
  type ButtonCoreProps,
  type ButtonCoreRenderProps,
  type ButtonCoreHandlers,
} from './components/button/ButtonCore';

export {
  CheckboxCore,
  type CheckboxCoreProps,
  type CheckboxCoreRenderProps,
  type CheckboxCoreState,
  type CheckboxCoreHandlers,
} from './components/checkbox/CheckboxCore';

export {
  RadioCore,
  type RadioCoreProps,
  type RadioCoreRenderProps,
  type RadioCoreState,
  type RadioCoreHandlers,
} from './components/radio/RadioCore';

export {
  RadioGroupCore,
  RadioGroupCoreContext,
  type RadioGroupCoreProps,
  type RadioGroupCoreRenderProps,
  type RadioGroupCoreContextValue,
} from './components/radio/RadioGroupCore';

export {
  InputCore,
  type InputCoreProps,
  type InputCoreRef,
  type InputCoreRenderProps,
  type InputCoreState,
  type InputCoreInputProps,
} from './components/input/InputCore';

export {
  ToggleCore,
  type ToggleCoreProps,
  type ToggleCoreRenderProps,
  type ToggleCoreState,
  type ToggleCoreHandlers,
} from './components/toggle/ToggleCore';

export {
  SelectCore,
  type SelectCoreProps,
  type SelectCoreRenderProps,
  type SelectCoreState,
  type SelectCoreTriggerHandlers,
} from './components/select/SelectCore';
