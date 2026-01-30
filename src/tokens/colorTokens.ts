// ---------------------------------------------
// ElementForge Color Tokens
// ---------------------------------------------

export const colorTokens = {
  primary: 'var(--ef-color-primary)',
  primaryDark: 'var(--ef-color-primary-dark)',
  primaryLight: 'var(--ef-color-primary-light)',
  secondary: 'var(--ef-color-secondary)',
  secondaryDark: 'var(--ef-color-secondary-dark)',
  secondaryLight: 'var(--ef-color-secondary-light)',

  success: 'var(--ef-color-success)',
  warning: 'var(--ef-color-warning)',
  danger: 'var(--ef-color-error)',
  info: 'var(--ef-color-info)',

  text: 'var(--ef-color-text)',
  subtle: 'var(--ef-color-text-secondary)',

  surface: 'var(--ef-color-surface)',
  surfaceAlt: 'var(--ef-color-surface-alt)',
} as const;

// Type-safe union of all color names
export type ColorToken = keyof typeof colorTokens;

// Helper to resolve a color name to its CSS variable
export const resolveColor = (color: ColorToken) => colorTokens[color];

export const textColorTokens = {
  primary: 'var(--ef-color-on-primary)',
  primaryDark: 'var(--ef-color-on-primary-dark)',
  primaryLight: 'var(--ef-color-on-primary-light)',
  secondary: 'var(--ef-color-on-secondary)',
  secondaryDark: 'var(--ef-color-on-secondary-dark)',
  secondaryLight: 'var(--ef-color-on-secondary-light)',

  success: 'var(--ef-color-on-success)',
  warning: 'var(--ef-color-on-warning)',
  danger: 'var(--ef-color-on-error)',
  info: 'var(--ef-color-on-info)',

  text: 'var(--ef-color-on-text)',
  subtle: 'var(--ef-color-on-text-secondary)',

  surface: 'var(--ef-color-on-surface)',
  surfaceAlt: 'var(--ef-color-on-surface-alt)',
} as const;

// Helper to resolve a color name to its CSS variable
export const resolveTextColor = (color: ColorToken) => textColorTokens[color];