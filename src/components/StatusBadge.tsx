import { ClothingStatus } from '../api/client';

type StatusBadgeProps = {
  status: ClothingStatus;
};

const labels: Record<ClothingStatus, string> = {
  clean: 'Clean',
  worn: 'Worn',
  laundry: 'Laundry',
  unavailable: 'Unavailable',
  repair: 'Repair',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>;
}
