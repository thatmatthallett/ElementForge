export const anchorBlockPositions = [
  'top-inside',
  'top-outside',
  'bottom-inside',
  'bottom-outside',
  'center',
 ] as const;

 export const anchorInlinePositions = [
  'left-inside',
  'left-outside',
  'right-inside',
  'right-outside',
  'center',
 ] as const;
 
 export type anchorPositionBlockSet = (typeof anchorBlockPositions)[number];
 export type anchorPositionInlineSet = (typeof anchorInlinePositions)[number];