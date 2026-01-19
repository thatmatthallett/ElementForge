/**
 * Central registry of all custom events emitted by the design system.
 * Each key is the event name, and the value is the typed `detail` payload.
 *
 * Use `undefined` for events that do not carry a detail payload.
 */
import type { StatusSet } from "../tokens";

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
  'ef-hover': { hovering: boolean };
  "ef-validate": { status?: StatusSet ; message?: string };

  // Modal events
  'ef-open': { source: 'keyboard' | 'mouse' | 'programmatic' };
  'ef-close': { reason: 'escape' | 'backdrop' | 'programmatic' };

  // Select component events
  'ef-select': { value: string | number };
  'ef-select-open': undefined;
  'ef-select-close': undefined;

  // Loading component events
  'ef-loading': { efId: string; active: boolean;};
  'ef-loading-start':  { efId: string }; // event emmmited to trigger loading
  'ef-loading-end': { efId: string }; // event emmmited to remove loading
  

  // Add more component-specific events here...
};
