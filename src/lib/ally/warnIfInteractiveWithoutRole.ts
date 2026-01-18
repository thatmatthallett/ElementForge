import type { EfElement } from '../ef-element';

export function warnIfInteractiveWithoutRole(el: EfElement) {
  if (!import.meta.env.DEV) return;

  const isInteractive =
    el.hasAttribute('onclick') ||
    el.getAttribute('tabindex') === '0';

  const hasRole = el.hasAttribute('role');

  if (isInteractive && !hasRole) {
    el.log('Interactive element missing role attribute');
  }
}