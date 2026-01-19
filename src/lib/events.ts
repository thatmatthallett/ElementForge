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
  'ef-focus': {} as {},
  'ef-blur': {} as {},
  'ef-hover': {} as { hovering: boolean },
  'ef-validate': {} as { status?: StatusSet; message?: string },

  // Modal events
  'ef-open': {} as { source: 'keyboard' | 'mouse' | 'programmatic' },
  'ef-close': {} as { reason: 'escape' | 'backdrop' | 'programmatic' },

  // Select component events
  'ef-select': {} as { value: string | number },
  'ef-select-open': {} as {},
  'ef-select-close': {} as {},

  // Loading component events
  'ef-loading': {} as { active: boolean },
  'ef-loading-start': {} as {},
  'ef-loading-end': {} as {},
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
type WithEfId<T> = T extends undefined ? { efId: string } : T & { efId: string };

export type ComponentEvents = {
  [K in keyof typeof eventDefinitions]: WithEfId<typeof eventDefinitions[K]>
};

export type EventOf<K extends keyof ComponentEvents> =
  CustomEvent<ComponentEvents[K]>;