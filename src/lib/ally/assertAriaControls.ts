import type { LpElement } from '../lp-element';

export function assertAriaControls(el: LpElement, targetId: string) {
  if (!import.meta.env.DEV) return;

  const attr = el.getAttribute('aria-controls');

  if (!attr) {
    el.log('Missing aria-controls attribute');
    return;
  }

  if (attr !== targetId) {
    el.log(`aria-controls="${attr}" does not match expected target "${targetId}"`);
    return;
  }

  if (!document.getElementById(targetId))
    el.log(`aria-controls references missing element id="${targetId}"`);
}