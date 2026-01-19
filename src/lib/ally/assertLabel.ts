import { dsLogger } from '../../utils';
import type { EfElement } from '../ef-element';

export function assertLabel(el: EfElement) {
  if (!import.meta.env.DEV) return;

  const hasLabel =
    el.getAttribute('aria-label') ||
    el.getAttribute('aria-labelledby') ||
    el.textContent?.trim();

  if (!hasLabel) {
    dsLogger.warn(el.componentName, 'Component is missing an accessible label');
  }
}