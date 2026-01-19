import { dsLogger } from '../../utils';
import type { EfElement } from '../ef-element';

export function assertSingleTabStop(el: EfElement) {
  if (!import.meta.env.DEV) return;

  const focusables = el.shadowRoot?.querySelectorAll(
    '[tabindex], button, input, select, textarea, a[href]'
  );

  if (!focusables) return;

  if (focusables.length > 1) {
    dsLogger.warn(el.componentName,
      `Component has multiple focusable elements (${focusables.length}). ` +
      `Ensure only the host or a single internal element is focusable.`
    );
  }
}