import { type StatusSet } from '../tokens';

export function getStatusIcon(status?: StatusSet, filled?: boolean): IconName {
  let iconName: IconName = 'info-circle-filled';
  switch (status) {
    case 'error': iconName = 'alert-circle'; break;
    case 'warning': iconName = 'alert-triangle'; break;
    case 'success': iconName = 'circle-check'; break;
    case 'info': iconName = 'info-circle'; break;
    default: iconName = 'info-circle';
  }

  return filled ? `${iconName}-filled` : iconName;
}