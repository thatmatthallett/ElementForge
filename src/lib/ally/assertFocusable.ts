import { dsLogger } from '../../utils';
import type { EfElement } from '../ef-element';

export function assertFocusable(el: EfElement) {
  if (!import.meta.env.DEV) return;

  const tabindex = el.getAttribute('tabindex');
  const disabled = el.hasAttribute('disabled');

  // Disabled elements should NOT be focusable
  if (disabled && tabindex !== null) {
    dsLogger.warn(el.componentName, 'Disabled component should not be focusable (remove tabindex)');
    return;
  }

  // Interactive components must be focusable
  const isInteractive =
    el.hasAttribute('role') ||
    el.hasAttribute('onclick') ||
    el.getAttribute('aria-pressed') !== null;

  if (isInteractive && tabindex === null && !disabled) 
    dsLogger.warn(el.componentName, 'Interactive component is not focusable (missing tabindex="0")');
}