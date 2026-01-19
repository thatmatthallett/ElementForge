export const strokeWidthTokens = {
  thin: '1',
  regular: '2',
  bold: '3'
} as const;

export type StrokeWidthPreset = keyof typeof strokeWidthTokens;
