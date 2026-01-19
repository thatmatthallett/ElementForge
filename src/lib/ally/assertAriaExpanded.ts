import { dsLogger } from '../../utils';
import type { EfElement } from '../ef-element';

export function assertAriaExpanded(el: EfElement, expanded: boolean) {
  if (!import.meta.env.DEV) return;

  const attr = el.getAttribute('aria-expanded');

  if (attr === null) {
    dsLogger.warn(el.componentName, 'Missing aria-expanded attribute on expandable component');
    return;
  }

  const value = attr === 'true';

  if (value !== expanded)
    dsLogger.warn(el.componentName, `aria-expanded="${attr}" does not match component state (${expanded})`);
}