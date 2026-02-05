/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  GestureResponderEvent,
} from 'react-native';
import {
  fireEvent,
  render,
  RenderAPI,
  waitFor,
} from '@testing-library/react-native';
import { ReactTestInstance } from 'react-test-renderer';
import { StyleProvider } from './styleProvider.component';
import { StyledComponentProps } from './styled';
import { StyleConsumerService } from './styleConsumer.service';
import {
  Interaction,
  StyleService,
  useStyleSheet,
} from './style.service';
import { useStyled } from './useStyled';
import { ThemeStyleType } from '@kitsuine/processor';
import { ThemeType } from '@kitsuine/components';

const theme = {
  defaultColor: '#000000',
  disabledColor: '#646464',
  activeColor: '#3366FF',
  refValue: '$defaultColor',
  doubleRefValue: '$refValue',
};

const computedMapping = {
  Test: {
    meta: {
      scope: 'all',
      parameters: {
        width: {
          type: 'number',
        },
        height: {
          type: 'number',
        },
        backgroundColor: {
          type: 'string',
        },
      },
      appearances: {
        default: {
          default: true,
        },
      },
      variantGroups: {},
      states: {
        disabled: {
          default: false,
          priority: 0,
          scope: 'all',
        },
        active: {
          default: false,
          priority: 1,
          scope: 'all',
        },
      },
    },
    styles: {
      'default': {
        width: 4,
        height: 4,
        backgroundColor: 'defaultColor',
      },
      'default.disabled': {
        width: 4,
        height: 4,
        backgroundColor: 'disabledColor',
      },
      'default.active': {
        width: 4,
        height: 4,
        backgroundColor: 'activeColor',
      },
    },
  },
};

describe('@style: consumer service methods check', () => {

  const service: StyleConsumerService = new StyleConsumerService('Test', computedMapping);

  it('should create valid default props', () => {
    const value: StyledComponentProps = service.createDefaultProps();

    expect(value).toEqual({
      appearance: 'default',
    });
  });

  it('should create valid style prop', () => {
    const props: StyledComponentProps = service.createDefaultProps();
    const style = service.createStyleProp(props, computedMapping, theme, []);

    expect(style).toEqual({
      width: 4,
      height: 4,
      backgroundColor: theme.defaultColor,
    });
  });
});

describe('@style-service: service method checks', () => {

  it('should apply theme on mapping', () => {
    const mapping = {
      prop1: 'defaultColor',
      prop2: 'refValue',
      prop3: 'doubleRefValue',
    };

    const value = StyleService.createThemedEntry(mapping, theme);

    expect(value).toEqual({
      prop1: theme.defaultColor,
      prop2: theme.defaultColor,
      prop3: theme.defaultColor,
    });
  });

});

describe('@useStyled: functional component checks', () => {

  const styleConsumerTestId = '@style/consumer';
  const styleTouchableTestId = '@style/touchable';

  // Functional Test component using useStyled hook
  interface TestProps {
    disabled?: boolean;
    testID?: string;
    onStyleChange?: (result: { style: object; theme: object; dispatch: (i: Interaction[]) => void }) => void;
  }

  const Test: React.FC<TestProps> = ({ disabled, testID, onStyleChange, ...restProps }) => {
    const result = useStyled('Test', { disabled });

    // Expose the styled result for testing
    React.useEffect(() => {
      if (onStyleChange) {
        onStyleChange(result);
      }
    }, [result, onStyleChange]);

    return (
      <View
        {...restProps}
        testID={testID || styleConsumerTestId}
        style={result.style}
      />
    );
  };

  const Provider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
    return (
      <StyleProvider
        styles={computedMapping}
        theme={theme}
      >
        {children}
      </StyleProvider>
    );
  };

  it('useStyled component should not re-render because of parent render (memoized)', async () => {
    const rerenderButtonText = 'Rerender parent';
    const getRenderCountText = (elementType: string, count: number): string => {
      return `${elementType}: render for ${count} ${count === 1 ? 'time' : 'times'}`;
    };

    // Memoized child component using useStyled
    const ChildStyledComponent = React.memo(() => {
      const renderCountRef = React.useRef(0);
      renderCountRef.current++;
      useStyled('Test', {});

      return (
        <Text>
          {getRenderCountText('Child', renderCountRef.current)}
        </Text>
      );
    });

    ChildStyledComponent.displayName = 'ChildStyledComponent';

    const ParentComponent = (): React.ReactElement => {
      const [renderCount, setRenderCount] = React.useState(1);
      return (
        <View>
          <TouchableOpacity onPress={() => setRenderCount(renderCount + 1)}>
            <Text>
              {rerenderButtonText}
            </Text>
          </TouchableOpacity>
          <Text>
            {getRenderCountText('Parent', renderCount)}
          </Text>
          <ChildStyledComponent />
        </View>
      );
    };

    const renderedComponent: RenderAPI = render(<ParentComponent />, { wrapper: Provider });
    fireEvent.press(renderedComponent.getByText(rerenderButtonText));
    fireEvent.press(renderedComponent.getByText(rerenderButtonText));

    expect(renderedComponent.queryByText(getRenderCountText('Parent', 3))).toBeTruthy();
    expect(renderedComponent.queryByText(getRenderCountText('Child', 1))).toBeTruthy();
  });

  it('returns style, theme, and dispatch from useStyled', async () => {
    let capturedResult: { style: object; theme: object; dispatch: (i: Interaction[]) => void } | null = null;

    const component: RenderAPI = render(
      <StyleProvider
        styles={computedMapping}
        theme={theme}
      >
        <Test onStyleChange={(result) => { capturedResult = result; }} />
      </StyleProvider>,
    );

    await waitFor(() => {
      expect(capturedResult).not.toBeNull();
    });

    expect(capturedResult!.style).toBeTruthy();
    expect(capturedResult!.theme).toBeTruthy();
    expect(capturedResult!.dispatch).toBeTruthy();
  });

  it('default appearance styled properly', async () => {
    let defaultResult: { style: object } | null = null;
    let disabledResult: { style: object } | null = null;

    render(
      <StyleProvider
        styles={computedMapping}
        theme={theme}
      >
        <Test onStyleChange={(result) => { defaultResult = result; }} />
      </StyleProvider>,
    );

    render(
      <StyleProvider
        styles={computedMapping}
        theme={theme}
      >
        <Test disabled={true} onStyleChange={(result) => { disabledResult = result; }} />
      </StyleProvider>,
    );

    await waitFor(() => {
      expect(defaultResult).not.toBeNull();
      expect(disabledResult).not.toBeNull();
    });

    expect(defaultResult!.style).toEqual({
      width: 4,
      height: 4,
      backgroundColor: theme.defaultColor,
    });

    expect(disabledResult!.style).toEqual({
      width: 4,
      height: 4,
      backgroundColor: theme.disabledColor,
    });
  });

  it('dispatch action works properly', async () => {
    let capturedResult: { style: object; dispatch: (i: Interaction[]) => void } | null = null;

    const TestWithDispatch: React.FC = () => {
      const result = useStyled('Test', {});

      React.useEffect(() => {
        capturedResult = result;
      }, [result]);

      return (
        <TouchableOpacity
          testID={styleTouchableTestId}
          onPress={() => result.dispatch([Interaction.ACTIVE])}
        >
          <View testID={styleConsumerTestId} style={result.style} />
        </TouchableOpacity>
      );
    };

    const component: RenderAPI = render(
      <StyleProvider
        styles={computedMapping}
        theme={theme}
      >
        <TestWithDispatch />
      </StyleProvider>,
    );

    await waitFor(() => {
      expect(capturedResult).not.toBeNull();
    });

    // Initial style
    expect(capturedResult!.style).toEqual({
      width: 4,
      height: 4,
      backgroundColor: theme.defaultColor,
    });

    // Dispatch active interaction
    fireEvent.press(component.getByTestId(styleTouchableTestId));

    await waitFor(() => {
      expect(capturedResult!.style).toEqual({
        width: 4,
        height: 4,
        backgroundColor: theme.activeColor,
      });
    });
  });

  it('provides correct styles on theme change', async () => {
    interface IThemeChangingProvider {
      styles: ThemeStyleType;
      theme: ThemeType;
      themeInverse: ThemeType;
      children: React.ReactNode;
    }

    const ThemeChangingProvider = (props: IThemeChangingProvider): React.ReactElement => {
      const [currentTheme, setCurrentTheme] = React.useState(props.theme);

      return (
        <StyleProvider
          styles={props.styles}
          theme={currentTheme}
        >
          <TouchableOpacity
            testID={styleTouchableTestId}
            onPress={() => setCurrentTheme(props.themeInverse)}
          >
            {props.children}
          </TouchableOpacity>
        </StyleProvider>
      );
    };

    let capturedResult: { style: object } | null = null;

    const TestWithCapture: React.FC = () => {
      const result = useStyled('Test', {});
      React.useEffect(() => {
        capturedResult = result;
      }, [result]);
      return <View testID={styleConsumerTestId} style={result.style} />;
    };

    const component: RenderAPI = render(
      <ThemeChangingProvider
        styles={computedMapping}
        theme={theme}
        themeInverse={{
          ...theme,
          defaultColor: '#ffffff',
        }}
      >
        <TestWithCapture />
      </ThemeChangingProvider>,
    );

    await waitFor(() => {
      expect(capturedResult).not.toBeNull();
    });

    const touchableComponent: ReactTestInstance = component.getByTestId(styleTouchableTestId);
    fireEvent.press(touchableComponent);

    await waitFor(() => {
      expect(capturedResult!.style).toEqual({
        ...computedMapping.Test.styles.default,
        backgroundColor: '#ffffff',
      });
    });
  });
});

describe('@useStyleSheet: rendering performance check', () => {
  const styleTouchableTestId = '@style/touchable';

  interface IThemeChangingProvider {
    styles: ThemeStyleType;
    theme: ThemeType;
    onPress: (event: GestureResponderEvent) => void;
    value: string | number;
  }

  const ThemeChangingProvider = (props: IThemeChangingProvider): React.ReactElement => {
    return (
      <StyleProvider
        styles={props.styles}
        theme={theme}
      >
        <TouchableOpacity
          testID={styleTouchableTestId}
          onPress={props.onPress}
        >
          <Text style={{ color: theme.defaultColor }}>
            {`${props.value}`}
          </Text>
        </TouchableOpacity>
      </StyleProvider>
    );
  };

  it('useStyleSheet should not be called with every render', async () => {
    const stylesFuncMock = jest.fn();

    const Component = (): React.ReactElement => {
      const [state, setState] = React.useState(0);
      const styles = useStyleSheet({});

      React.useEffect(() => {
        stylesFuncMock();
      }, [styles]);

      return (
        <ThemeChangingProvider
          styles={computedMapping}
          theme={theme}
          onPress={() => setState(state + 1)}
          value={theme.defaultColor}
        />
      );
    };

    const component = render(<Component />);
    fireEvent.press(component.getByTestId(styleTouchableTestId));
    expect(stylesFuncMock).toBeCalledTimes(1);
  });

  it('useStyleSheet should not be called with every render when memoized', async () => {
    const stylesFuncMock = jest.fn();

    const Component = (): React.ReactElement => {
      const [state, setState] = React.useState(0);
      const styles = useStyleSheet({});

      const memoizeValue = React.useMemo(() => {
        stylesFuncMock();
        return theme;
      }, [styles]);

      const changeState = React.useCallback(() => {
        setState(state + 1);
      }, [state, memoizeValue]);

      return (
        <ThemeChangingProvider
          styles={computedMapping}
          theme={theme}
          onPress={changeState}
          value={theme.defaultColor}
        />
      );
    };

    const component = render(<Component />);
    expect(stylesFuncMock).toBeCalledTimes(1);
    fireEvent.press(component.getByTestId(styleTouchableTestId));
    expect(stylesFuncMock).toBeCalledTimes(1);
  });
});
