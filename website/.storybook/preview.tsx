import React from 'react';
import type { Preview } from '@storybook/react-vite';
import * as eva from '@kittsune/eva';
import { ApplicationProvider, IconRegistry } from '@kittsune/components';
import { EvaIconsPack } from '@kittsune/eva-icons';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Eva theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const themeName = context.globals.theme || 'light';
      const theme = themeName === 'dark' ? eva.dark : eva.light;
      return (
        <>
          <IconRegistry icons={[EvaIconsPack]} />
          <ApplicationProvider {...eva} theme={theme}>
            <Story />
          </ApplicationProvider>
        </>
      );
    },
  ],
};

export default preview;
