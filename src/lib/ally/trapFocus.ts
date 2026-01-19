import { dsLogger } from '../../utils';
import type { EfElement } from '../ef-element';

export function trapFocus(el: EfElement) {
  const root = el.shadowRoot;
  if (!root) {
    if (import.meta.env.DEV) dsLogger.warn(el.componentName, 'Cannot trap focus: no shadowRoot found');
    return;
  }

  const focusables = root.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusables.length === 0) {
    if (import.meta.env.DEV) dsLogger.warn(el.componentName, 'Focus trap warning: no focusable elements inside component');
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  const handler: EventListener = (event) => {
    const e = event as KeyboardEvent;
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  root.addEventListener('keydown', handler);

  if (import.meta.env.DEV) {
    dsLogger.warn(el.componentName, 'Focus trap activated');
  }

  return () => root.removeEventListener('keydown', handler);
}