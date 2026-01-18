import type { EfElement } from '../lib/ef-element';

export function observeAttributes(
  el: EfElement,
  callback: (name: string, oldValue: string | null, newValue: string | null) => void
) {
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type !== 'attributes') continue;

      const name = m.attributeName!;
      const oldValue = m.oldValue;
      const newValue = el.getAttribute(name);

      callback(name, oldValue, newValue);
    }
  });

  observer.observe(el, {
    attributes: true,
    attributeOldValue: true
  });

  return () => observer.disconnect();
}
