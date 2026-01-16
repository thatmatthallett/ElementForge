import type { LpElement } from '../lp-element';

export function ensureTabbable(el: LpElement) {
  const hadTabindex = el.hasAttribute('tabindex');

  if (!hadTabindex) {
    el.setAttribute('tabindex', '0');
  }

  if (import.meta.env.DEV && !hadTabindex) {
    el.log('Added tabindex="0" to make component tabbable');
  }
}