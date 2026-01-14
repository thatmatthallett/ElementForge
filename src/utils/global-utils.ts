import { iconNames, type IconName } from '../assets/icons/icon-types';
import { colorSetValues, type ColorSet } from '../types/colorSet';

export function isIconName(value: string): value is IconName {
  return iconNames.includes(value as IconName);
}

export function isColorSet(value: string): value is ColorSet {
  return colorSetValues.includes(value as ColorSet);
}