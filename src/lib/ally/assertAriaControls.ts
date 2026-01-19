import { dsLogger } from '../../utils';
import type { EfElement } from '../ef-element';

export function assertAriaControls(el: EfElement, targetId: string) {
  if (!import.meta.env.DEV) return;

  const attr = el.getAttribute('aria-controls');

  if (!attr) {
    dsLogger.warn(el.componentName, 'Missing aria-controls attribute');
    return;
  }

  if (attr !== targetId) {
    dsLogger.warn(el.componentName, `aria-controls="${attr}" does not match expected target "${targetId}"`);
    return;
  }

  if (!document.getElementById(targetId))
    dsLogger.warn(el.componentName, `aria-controls references missing element id="${targetId}"`);
}