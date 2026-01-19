// ---------------------------------------------
// ElementForge Shape Tokens
// ---------------------------------------------

export const shapeValues = [
  'square',
  'rounded',
  'pill',
  'link'
] as const;

export type ShapeSet = (typeof shapeValues)[number];

export const shapeRadius = {
  square: '0',
  rounded: '0.375rem',
  pill: '100vw',
  link: '0'
} as const;

export type ShapeRadiusSet = keyof typeof shapeRadius;
