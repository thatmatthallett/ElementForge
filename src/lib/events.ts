/**
 * Central registry of all custom events emitted by the design system.
 * Each key is the event name, and the value is the typed `detail` payload.
 *
 * Use `undefined` for events that do not carry a detail payload.
 */
export type ComponentEvents = {
  // Generic UI events
  'lp-change': { value: unknown };
  'lp-click': { 
    originalEvent: MouseEvent;
    source?: 'keyboard' | 'mouse';
   };
  'lp-input': { value: unknown };
  'lp-focus': undefined;
  'lp-blur': undefined;

  // Icon component events
  'lp-icon-load': { name: string };
  'lp-icon-error': { name: string; error: Error };

  // Modal events
  'lp-open': { source: 'keyboard' | 'mouse' | 'programmatic' };
  'lp-close': { reason: 'escape' | 'backdrop' | 'programmatic' };

  // Select component events
  'lp-select': { value: string | number };
  'lp-select-open': undefined;
  'lp-select-close': undefined;

  // Add more component-specific events here...
};
