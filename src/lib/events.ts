import type { StatusSet } from '../tokens';

/**
 * Single source of truth for all design system events.
 * Each key is the event name.
 * Each value is the typed detail payload.
 */
export const eventDefinitions = {
  // Generic UI events
  'ef-change': {} as { value: unknown },
  'ef-click': {} as { originalEvent: MouseEvent; source?: 'keyboard' | 'mouse' },
  'ef-input': {} as { value: unknown },
  'ef-focus': undefined as undefined,
  'ef-blur': undefined as undefined,
  'ef-hover': {} as { hovering: boolean },
  'ef-validate': {} as { status?: StatusSet; message?: string },

  // Modal events
  'ef-open': {} as { source: 'keyboard' | 'mouse' | 'programmatic' },
  'ef-close': {} as { reason: 'escape' | 'backdrop' | 'programmatic' },

  // Select component events
  'ef-select': {} as { value: string | number },
  'ef-select-open': undefined as undefined,
  'ef-select-close': undefined as undefined,

  // Loading component events
  'ef-loading': {} as { efId: string; active: boolean },
  'ef-loading-start': {} as { efId: string },
  'ef-loading-end': {} as { efId: string },
} as const;

/**
 * Runtime array of event names.
 * Generated automatically from eventDefinitions.
 */
export const efEvents = Object.keys(eventDefinitions) as Array<keyof typeof eventDefinitions>;

/**
 * Typed event map.
 * Generated automatically from eventDefinitions.
 */
export type ComponentEvents = {
  [K in keyof typeof eventDefinitions]: typeof eventDefinitions[K]
};
