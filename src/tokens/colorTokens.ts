// ---------------------------------------------
// ElementForge Color Tokens
// ---------------------------------------------

export const colorTokens = {
  primary: 'var(--ef-color-primary)',
  secondary: 'var(--ef-color-secondary)',

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