import type { EfElement } from '../ef-element';

export function assertAltText(el: EfElement) {
  if (!import.meta.env.DEV) return;

  const alt = el.getAttribute('alt');
  if (!alt) {
    el.log('Missing alt text for image/icon component');
  }
}