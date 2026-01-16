import type { LpElement } from '../lp-element';

export function assertLabel(el: LpElement) {
  if (!import.meta.env.DEV) return;

  const hasLabel =
    el.getAttribute('aria-label') ||
    el.getAttribute('aria-labelledby') ||
    el.querySelector('[slot="label"]');

  if (!hasLabel) {
    el.log('Component is missing an accessible label');
  }
}