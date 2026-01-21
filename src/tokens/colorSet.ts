export const colorValues = [
  'primary',
  'primaryDark',
  'primaryLight',
  'secondary',
  'secondaryDark',
  'secondaryLight',
  'success',
  'warning',
  'danger',
  'info',
  'text',
  'subtle',
  'surface',
  'surfaceAlt'
] as const;


export type ColorSet = (typeof colorValues)[number];