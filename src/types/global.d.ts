import type { ComponentEvents } from '../lib/events';

declare global {
  type IconName = import('../assets/icons/icon-types').IconName;

  type ColorSet = import('../types').ColorSet;

  interface HTMLElementEventMap extends HTMLElementEventMap {}

  namespace JSX {
    interface IntrinsicElements {
      'ef-icon': {
        name: IconName;
        size?: string;
        stroke?: ColorSet;
      };
    }
  }
}

export {};
