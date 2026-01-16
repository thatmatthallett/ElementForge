import type { LpElement } from '../lp-element';

export function trapFocus(el: LpElement) {
  if (!import.meta.env.DEV) return;

  const root = el.shadowRoot;
  if (!root) {
    el.log('Cannot trap focus: no shadowRoot found');
    return;
  }

  const focusables = root.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusables.length === 0) {
    el.log('Focus trap warning: no focusable elements inside component');
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  const handler: EventListener = (event) => {
    const e = event as KeyboardEvent;
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift+Tab on first element → wrap to last
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab on last element → wrap to first
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  root.addEventListener('keydown', handler);

  // Return cleanup function
  return () => root.removeEventListener('keydown', handler);
}
