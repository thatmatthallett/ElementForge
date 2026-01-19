export const colorValues = [
  'primary',
  'secondary',
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