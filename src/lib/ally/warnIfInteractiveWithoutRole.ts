import type { LpElement } from '../lp-element';

export function warnIfInteractiveWithoutRole(el: LpElement) {
  if (!import.meta.env.DEV) return;

  const isInteractive =
    el.hasAttribute('onclick') ||
    el.getAttribute('tabindex') === '0';

  const hasRole = el.hasAttribute('role');

  if (isInteractive && !hasRole) {
    el.log('Interactive element missing role attribute');
  }
}