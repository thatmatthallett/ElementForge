import type { LpElement } from '../lp-element';

export function ensureTabbable(el: LpElement) {
  if (!import.meta.env.DEV) return;

  if (!el.hasAttribute('tabindex')) {
    el.setAttribute('tabindex', '0');
  }
}