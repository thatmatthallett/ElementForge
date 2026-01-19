import { dsLogger } from '../../utils';
import type { EfElement } from '../ef-element';

export function restoreFocus(el: EfElement) {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  return () => {
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    } else {
      if (import.meta.env.DEV) {
        dsLogger.warn(el.componentName, 'Focus restoration warning: previous element no longer exists');
      }
    }
  };
}