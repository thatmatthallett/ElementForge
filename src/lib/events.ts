/**
 * Central registry of all custom events emitted by the design system.
 * Each key is the event name, and the value is the typed `detail` payload.
 *
 * Use `undefined` for events that do not carry a detail payload.
 */
export type ComponentEvents = {
  // Generic UI events
  'ef-change': { value: unknown };
  'ef-click': { 
    originalEvent: MouseEvent;
    source?: 'keyboard' | 'mouse';
   };
  'ef-input': { value: unknown };
  'ef-focus': undefined;
  'ef-blur': undefined;

  // Icon component events
  'ef-icon-load': { name: string };
  'ef-icon-error': { name: string; error: Error };

  // Modal events
  'ef-open': { source: 'keyboard' | 'mouse' | 'programmatic' };
  'ef-close': { reason: 'escape' | 'backdrop' | 'programmatic' };

  // Select component events
  'ef-select': { value: string | number };
  'ef-select-open': undefined;
  'ef-select-close': undefined;

  // Loading component events
  'ef-loading-start':  { efId: string };
  'ef-loading-end': { efId: string };

  // Add more component-specific events here...
};
