import type { EfElement } from '../ef-element';

export function assertRequiredProps(el: EfElement, props: string[]) {
  if (!import.meta.env.DEV) return;

  for (const prop of props) {
    const value = (el as any)[prop];

    if (value === undefined || value === null || value === '') {
      el.log(`Missing required property: "${prop}"`);
    }
  }
}
