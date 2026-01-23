import { create } from 'storybook/theming';

export default create({
  base: 'light',

  brandTitle: 'ElementForge',
  brandUrl: 'https://elementforge.dev',
  brandImage: '../src/assets/logos/ef-hex-anvil-ef.svg',

  // Primary brand colors
  colorPrimary: '#bb5b24',
  colorSecondary: '#395975',

  // App surfaces
  appBg: '#f5f5f5',
  appContentBg: '#ffffff',
  appBorderColor: '#e5e7eb',
  appBorderRadius: 8,

  // Text
  textColor: '#111827',
  textInverseColor: '#ffffff',

  // Toolbar
  barBg: '#ffffff',
  barTextColor: '#374151',
  barSelectedColor: '#4f46e5',

  // Forms
  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  inputTextColor: '#111827',
  inputBorderRadius: 6,

  // Typography
  fontBase: 'Inter, sans-serif',
  fontCode: 'JetBrains Mono, monospace',
});
