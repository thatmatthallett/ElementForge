import type { ColorSet, ShapeSet } from '../tokens';

export interface AlertRequestDetail {
  message?: string;
  color?: ColorSet;
  duration?: number;
  dismissible?: boolean;
  icon?: string | null;
  shape?: ShapeSet;
  variant?: 'solid' | 'outline';

  /**
   * Optional custom renderer for advanced use cases.
   * If provided, ef-alert-container will use this instead of the default template.
   */
  render?: () => unknown;
}
