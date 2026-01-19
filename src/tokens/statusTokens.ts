export const statusValues = [
  'error',
  'warning',
  'success',
  'info'
] as const;

export type StatusSet = (typeof statusValues)[number];
