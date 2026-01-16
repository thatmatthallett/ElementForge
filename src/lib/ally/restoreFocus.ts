import type { LpElement } from '../lp-element';

export function restoreFocus(el: LpElement) {
  if (!import.meta.env.DEV) return;

  const previouslyFocused = document.activeElement as HTMLElement | null;

  return () => {
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    } else {
      el.log('Focus restoration warning: previous element no longer exists');
    }
  };
}