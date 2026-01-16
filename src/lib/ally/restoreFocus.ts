import type { LpElement } from '../lp-element';

export function restoreFocus(el: LpElement) {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  return () => {
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    } else {
      if (import.meta.env.DEV) {
        el.log('Focus restoration warning: previous element no longer exists');
      }
    }
  };
}