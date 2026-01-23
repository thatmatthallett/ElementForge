import { create } from 'storybook/theming';

export default create({
  base: 'dark',
  brandTitle: 'ElementForge',
  brandUrl: 'https://elementforge.dev',
  brandImage: '../src/assets/logos/ef-hex-anvil-ef.svg',

  colorPrimary: '#4f46e5',      // pick something close to your primary
  colorSecondary: '#ec4899',    // or whatever matches your accent

  appBg: '#f5f5f5',
  appContentBg: '#ffffff',
  appBorderColor: '#e5e7eb',
  appBorderRadius: 8,

  fontBase: 'Inter, sans-serif',
  fontCode: 'JetBrains Mono, monospace',
});
