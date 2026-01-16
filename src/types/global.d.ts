import type { ComponentEvents } from '../lib/events';

declare global {
  type IconName = import('../assets/icons/icon-types').IconName;

  type ColorSet = 'black' | 'gray' | 'blue' | 'slate' | 'lgray';

  interface HTMLElementEventMap extends HTMLElementEventMap {}

  namespace JSX {
    interface IntrinsicElements {
      'lp-icon': {
        name: IconName;
        size?: string;
        stroke?: ColorSet;
      };
    }
  }
}

export {};
