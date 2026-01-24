import type { Preview, Decorator } from '@storybook/web-components-vite';

import '../src/styles/tokens.css';

import '../src/assets/eventLogger.js';
import { background } from 'storybook/theming';

export const globalTypes = {
  theme: {
    name: 'Theme',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      items: ['light', 'dark'],
    },
  },
};

export const decorators: Decorator[] = [
  (Story, context) => {
    const theme = context.globals.theme || 'light';
    document.documentElement.dataset.theme = theme;
    return Story();
  },
];

export const parameters = { backgrounds: { disable: true }, };

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        dark: { name: 'Dark', value: 'var(--ef-color-surface)' },
        light: { name: 'Light', value: 'var(--ef-color-surface)' },
      }
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;