declare global {
  type IconName = import('../assets/icons/icon-types').IconName;

  type ColorSet = 'black' | 'gray' | 'blue' | 'slate' | 'lgray';

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
