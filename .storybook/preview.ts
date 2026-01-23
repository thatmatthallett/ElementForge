import type { Preview, Decorator } from '@storybook/web-components-vite';

import '../src/styles/index.css';

import '../src/assets/eventLogger.js';

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
    document.documentElement.dataset.theme = context.globals.theme;
    return Story();
  },
];

const preview: Preview = {
  parameters: {
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