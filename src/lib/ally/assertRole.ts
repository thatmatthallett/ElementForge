import { dsLogger } from '../../utils';
import type { EfElement } from '../ef-element';

export interface AssertRoleOptions {
  mustBe?: string;
  mustNotBe?: string | string[];
  mustNotExist?: boolean;
}


export function assertRole(
  el: EfElement,
  options: AssertRoleOptions
) {
  if (!import.meta.env.DEV) return;

  const role = el.getAttribute('role');

  // 1. Must not exist
  if (options.mustNotExist && role !== null) {
    dsLogger.warn(el.componentName, `Host should not have a role, but found role="${role}"`);
  }

  // 2. Must be a specific role
  if (options.mustBe && role !== options.mustBe) {
    dsLogger.warn(el.componentName, `Expected role="${options.mustBe}" but found "${role ?? 'none'}"`);
  }

  // 3. Must not be one or more specific roles
  if (options.mustNotBe) {
    const forbidden = Array.isArray(options.mustNotBe)
      ? options.mustNotBe
      : [options.mustNotBe];

    if (forbidden.includes(role ?? '')) {
      dsLogger.warn(el.componentName, `Host must not have role="${role}"`);
    }
  }
}
