import type { EfElement } from '../ef-element';

export function assertAriaExpanded(el: EfElement, expanded: boolean) {
  if (!import.meta.env.DEV) return;

  const attr = el.getAttribute('aria-expanded');

  if (attr === null) {
    el.log('Missing aria-expanded attribute on expandable component');
    return;
  }

  const value = attr === 'true';

  if (value !== expanded)
    el.log(`aria-expanded="${attr}" does not match component state (${expanded})`);
}