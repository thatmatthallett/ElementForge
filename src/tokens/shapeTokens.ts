// ---------------------------------------------
// ElementForge Shape Tokens
// ---------------------------------------------

export const shapeValues = [
  'square',
  'rounded',
  'pill'
] as const;

export type ShapeSet = (typeof shapeValues)[number];

export const shapeRadius = {
  square: '0',
  rounded: '0.375rem',
  pill: '100vh',
  link: '0'
} as const;

export type ShapeRadiusSet = keyof typeof shapeRadius;
