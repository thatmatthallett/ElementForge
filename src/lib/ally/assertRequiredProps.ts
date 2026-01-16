import type { LpElement } from '../lp-element';

export function assertRequiredProps(el: LpElement, props: string[]) {
  if (!import.meta.env.DEV) return;

  for (const prop of props) {
    const value = (el as any)[prop];

    if (value === undefined || value === null || value === '') {
      el.log(`Missing required property: "${prop}"`);
    }
  }
}
