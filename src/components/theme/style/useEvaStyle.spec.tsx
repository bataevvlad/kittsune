/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { light, mapping } from '@kitsuine/eva';
import { ApplicationProvider } from '../application/applicationProvider.component';
import { useEvaStyle, EvaStyleOptions, UseEvaStyleResult } from './useEvaStyle';

describe('@useEvaStyle: hook checks', () => {
  // Test component that renders the hook result
  let hookResult: UseEvaStyleResult | null = null;

  const TestComponent: React.FC<{
    componentName: string;
    options?: EvaStyleOptions;
  }> = ({ componentName, options }) => {
    hookResult = useEvaStyle(componentName, options);
    return (
      <View>
        <Text testID="container-style">{JSON.stringify(hookResult.styles.container)}</Text>
        <Text testID="text-style">{JSON.stringify(hookResult.styles.text)}</Text>
        <Text testID="icon-style">{JSON.stringify(hookResult.styles.icon)}</Text>
      </View>
    );
  };

  const renderHook = (componentName: string, options?: EvaStyleOptions) => {
    hookResult = null;
    render(
      <ApplicationProvider mapping={mapping} theme={light}>
        <TestComponent componentName={componentName} options={options} />
      </ApplicationProvider>,
    );
    return hookResult!;
  };

  beforeEach(() => {
    hookResult = null;
  });

  describe('split styles', () => {
    it('should return split styles with container, text, and icon', () => {
      const result = renderHook('Button');

      expect(result.styles).toBeDefined();
      expect(result.styles.container).toBeDefined();
      expect(result.styles.text).toBeDefined();
      expect(result.styles.icon).toBeDefined();
    });

    it('should extract text properties from raw style', () => {
      const result = renderHook('Button');

      // Text style should have color property extracted from textColor
      expect(result.styles.text).toHaveProperty('color');
      expect(result.styles.text).toHaveProperty('fontFamily');
      expect(result.styles.text).toHaveProperty('fontSize');
      expect(result.styles.text).toHaveProperty('fontWeight');
    });

    it('should extract icon properties from raw style', () => {
      const result = renderHook('Button');

      expect(result.styles.icon).toHaveProperty('width');
      expect(result.styles.icon).toHaveProperty('height');
      expect(result.styles.icon).toHaveProperty('tintColor');
    });

    it('should put remaining properties in container', () => {
      const result = renderHook('Button');

      // Container should have background and other properties
      expect(result.styles.container).toHaveProperty('backgroundColor');
      expect(result.styles.container).toHaveProperty('borderRadius');
    });

    it('should also return rawStyle for advanced usage', () => {
      const result = renderHook('Button');

      expect(result.rawStyle).toBeDefined();
      // Raw style should contain all properties (text, icon, container combined)
      expect(result.rawStyle).toHaveProperty('textColor');
      expect(result.rawStyle).toHaveProperty('iconWidth');
      expect(result.rawStyle).toHaveProperty('backgroundColor');
    });
  });

  describe('appearance variants', () => {
    it('should apply filled appearance by default', () => {
      const result = renderHook('Button', { appearance: 'filled' });

      expect(result.styles.container.backgroundColor).toBeDefined();
    });

    it('should apply outline appearance', () => {
      const result = renderHook('Button', { appearance: 'outline' });

      expect(result.styles.container.borderWidth).toBeDefined();
    });

    it('should apply ghost appearance', () => {
      const result = renderHook('Button', { appearance: 'ghost' });

      // Ghost buttons typically have transparent background
      expect(result.styles.container).toBeDefined();
    });
  });

  describe('status variants', () => {
    it('should apply primary status by default', () => {
      const result = renderHook('Button', { status: 'primary' });

      expect(result.styles.container.backgroundColor).toBeDefined();
    });

    it('should apply success status', () => {
      const result = renderHook('Button', { status: 'success' });

      expect(result.styles.container).toBeDefined();
    });

    it('should apply danger status', () => {
      const result = renderHook('Button', { status: 'danger' });

      expect(result.styles.container).toBeDefined();
    });

    it('should apply warning status', () => {
      const result = renderHook('Button', { status: 'warning' });

      expect(result.styles.container).toBeDefined();
    });

    it('should apply info status', () => {
      const result = renderHook('Button', { status: 'info' });

      expect(result.styles.container).toBeDefined();
    });
  });

  describe('size variants', () => {
    it('should apply tiny size', () => {
      const tinyResult = renderHook('Button', { size: 'tiny' });
      const giantResult = renderHook('Button', { size: 'giant' });

      // Tiny should have smaller dimensions than giant
      expect(tinyResult.styles.container.minHeight).toBeLessThan(
        giantResult.styles.container.minHeight as number,
      );
    });

    it('should apply small size', () => {
      const result = renderHook('Button', { size: 'small' });

      expect(result.styles.container.minHeight).toBeDefined();
    });

    it('should apply medium size by default', () => {
      const result = renderHook('Button', { size: 'medium' });

      expect(result.styles.container.minHeight).toBeDefined();
    });

    it('should apply large size', () => {
      const result = renderHook('Button', { size: 'large' });

      expect(result.styles.container.minHeight).toBeDefined();
    });

    it('should apply giant size', () => {
      const result = renderHook('Button', { size: 'giant' });

      expect(result.styles.container.minHeight).toBeDefined();
    });
  });

  describe('interaction states', () => {
    it('should handle active state', () => {
      const normalResult = renderHook('Button');
      const activeResult = renderHook('Button', {
        states: { active: true },
      });

      // Active state should change the style (usually darker background)
      expect(activeResult.styles.container).toBeDefined();
      // The styles should be different when active
      expect(JSON.stringify(activeResult.rawStyle)).not.toEqual(
        JSON.stringify(normalResult.rawStyle),
      );
    });

    it('should handle hover state', () => {
      const normalResult = renderHook('Button');
      const hoverResult = renderHook('Button', {
        states: { hover: true },
      });

      expect(hoverResult.styles.container).toBeDefined();
      // Hover state should produce different styles
      expect(JSON.stringify(hoverResult.rawStyle)).not.toEqual(
        JSON.stringify(normalResult.rawStyle),
      );
    });

    it('should handle focused state', () => {
      const normalResult = renderHook('Button');
      const focusedResult = renderHook('Button', {
        states: { focused: true },
      });

      expect(focusedResult.styles.container).toBeDefined();
      // Focused state should produce different styles
      expect(JSON.stringify(focusedResult.rawStyle)).not.toEqual(
        JSON.stringify(normalResult.rawStyle),
      );
    });

    it('should handle disabled state', () => {
      const normalResult = renderHook('Button');
      const disabledResult = renderHook('Button', {
        states: { disabled: true },
      });

      expect(disabledResult.styles.container).toBeDefined();
      // Disabled state should produce different styles (usually muted)
      expect(JSON.stringify(disabledResult.rawStyle)).not.toEqual(
        JSON.stringify(normalResult.rawStyle),
      );
    });

    it('should handle checked state (for checkable components)', () => {
      const uncheckedResult = renderHook('CheckBox');
      const checkedResult = renderHook('CheckBox', {
        states: { checked: true },
      });

      expect(checkedResult.styles.container).toBeDefined();
      // Checked state should produce different styles
      expect(JSON.stringify(checkedResult.rawStyle)).not.toEqual(
        JSON.stringify(uncheckedResult.rawStyle),
      );
    });

    it('should handle indeterminate state', () => {
      const normalResult = renderHook('CheckBox');
      const indeterminateResult = renderHook('CheckBox', {
        states: { indeterminate: true },
      });

      expect(indeterminateResult.styles.container).toBeDefined();
      // Indeterminate state should produce different styles
      expect(JSON.stringify(indeterminateResult.rawStyle)).not.toEqual(
        JSON.stringify(normalResult.rawStyle),
      );
    });

    it('should handle multiple states simultaneously', () => {
      const result = renderHook('Button', {
        states: {
          active: true,
          focused: true,
        },
      });

      expect(result.styles.container).toBeDefined();
    });
  });

  describe('combined options', () => {
    it('should handle appearance + status + size together', () => {
      const result = renderHook('Button', {
        appearance: 'outline',
        status: 'success',
        size: 'large',
      });

      expect(result.styles.container).toBeDefined();
      expect(result.styles.container.borderWidth).toBeDefined();
    });

    it('should handle all options with states', () => {
      const result = renderHook('Button', {
        appearance: 'filled',
        status: 'danger',
        size: 'small',
        states: {
          active: true,
          disabled: false,
        },
      });

      expect(result.styles.container).toBeDefined();
      expect(result.styles.text).toBeDefined();
      expect(result.styles.icon).toBeDefined();
    });
  });

  describe('default values', () => {
    it('should work with empty options', () => {
      const result = renderHook('Button', {});

      expect(result.styles.container).toBeDefined();
      expect(result.styles.text).toBeDefined();
      expect(result.styles.icon).toBeDefined();
    });

    it('should work with undefined states', () => {
      const result = renderHook('Button', {
        appearance: 'filled',
        states: undefined,
      });

      expect(result.styles.container).toBeDefined();
    });

    it('should work with empty states object', () => {
      const result = renderHook('Button', {
        appearance: 'filled',
        states: {},
      });

      expect(result.styles.container).toBeDefined();
    });
  });
});
