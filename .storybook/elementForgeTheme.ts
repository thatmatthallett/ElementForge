import { create } from 'storybook/theming';

export default create({
  base: 'light',

  brandTitle: 'ElementForge',
  brandUrl: 'https://elementforge.dev',
  brandImage: '../src/assets/logos/ef-hex-anvil-ef.svg',

  // Primary brand colors
  colorPrimary: '#395975',
  colorSecondary: '#f77e36',

  // App surfaces
  appBg: '#e4e4e4',
  appContentBg: '#f5f5f5',
  appBorderColor: '#d1d1d1',
  appBorderRadius: 8,

  // Text
  textColor: '#0b0b0b',
  textInverseColor: '#f5f5f5',

  // Toolbar
  barBg: '#f5f5f5',
  barTextColor: '#0b0b0b',
  barSelectedColor: '#2c3f51',

  // Forms
  inputBg: '#f5f5f5',
  inputBorder: '#6e8aa3',
  inputTextColor: '#0b0b0b',
  inputBorderRadius: 6,

  // Typography
  fontBase: 'Inter, sans-serif',
  fontCode: 'JetBrains Mono, monospace',
});
