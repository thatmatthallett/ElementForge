export const colorSetValues = ['black', 'gray', 'blue', 'slate', 'lgray'] as const;

export type ColorSet = (typeof colorSetValues)[number];