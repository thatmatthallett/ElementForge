import type { LpElement } from '../lp-element';

export function assertRole(el: LpElement, expected: string) {
  if (!import.meta.env.DEV) return;

  const role = el.getAttribute('role');
  if (role !== expected) {
    el.log(`Expected role="${expected}" but found "${role ?? 'none'}"`);
  }
}