import type { LpElement } from '../lp-element';

export interface AssertRoleOptions {
  mustBe?: string;
  mustNotBe?: string | string[];
  mustNotExist?: boolean;
}


export function assertRole(
  el: LpElement,
  options: AssertRoleOptions
) {
  if (!import.meta.env.DEV) return;

  const role = el.getAttribute('role');

  // 1. Must not exist
  if (options.mustNotExist && role !== null) {
    el.log(`Host should not have a role, but found role="${role}"`);
  }

  // 2. Must be a specific role
  if (options.mustBe && role !== options.mustBe) {
    el.log(`Expected role="${options.mustBe}" but found "${role ?? 'none'}"`);
  }

  // 3. Must not be one or more specific roles
  if (options.mustNotBe) {
    const forbidden = Array.isArray(options.mustNotBe)
      ? options.mustNotBe
      : [options.mustNotBe];

    if (forbidden.includes(role ?? '')) {
      el.log(`Host must not have role="${role}"`);
    }
  }
}
