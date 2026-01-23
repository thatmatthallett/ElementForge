import { create } from 'storybook/theming';

export default create({
  base: 'dark',

  brandTitle: 'ElementForge',
  brandUrl: 'https://elementforge.dev',
  brandImage: '../src/assets/logos/ef-hex-anvil-ef.svg',

  // Primary brand colors
  colorPrimary: '#395975',
  colorSecondary: '#f77e36',

  // App surfaces
  appBg: '#1b1b1a',
  appContentBg: '#292929',
  appBorderColor: '#d1d1d1',
  appBorderRadius: 8,

  // Text
  textColor: '#292929',
  textInverseColor: '#0b0b0b',

  // Toolbar
  barBg: '#292929',
  barTextColor: '#292929',
  barSelectedColor: '#2c3f51',

  // Forms
  inputBg: '#292929',
  inputBorder: '#6e8aa3',
  inputTextColor: '#292929',
  inputBorderRadius: 6,

  // Typography
  fontBase: 'Inter, sans-serif',
  fontCode: 'JetBrains Mono, monospace',
});
