import { iconNames, type IconName } from '../assets/icons/icon-types';
import { colorValues, type ColorSet } from '../tokens';

export function isIconName(value: string): value is IconName {
  return iconNames.includes(value as IconName);
}

export function isColorSet(value: string): value is ColorSet {
  return colorValues.includes(value as ColorSet);
}

export function isButtonType(value: string | null): value is 'button' | 'submit' | 'reset' {
  return value === 'button' || value === 'submit' || value === 'reset';
}
