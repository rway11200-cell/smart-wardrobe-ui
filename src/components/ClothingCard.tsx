import { ClothingItem, ClothingStatus } from '../api/client';
import { StatusBadge } from './StatusBadge';

type ClothingCardProps = {
  item: ClothingItem;
  onChangeStatus: (item: ClothingItem, status: ClothingStatus) => void;
  isUpdating: boolean;
};

function formatRating(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function ClothingCard({ item, onChangeStatus, isUpdating }: ClothingCardProps) {
  const canMarkClean = item.current_status !== 'clean';
  const canMarkUnavailable = ['clean', 'worn', 'laundry'].includes(item.current_status);
  const canSendToRepair = ['clean', 'worn', 'unavailable'].includes(item.current_status);

  return (
    <article className="clothing-card">
      {item.image_url && (
        <img className="clothing-image" src={item.image_url} alt={item.name} />
      )}

      <div className="card-header">
        <div>
          <h3>{item.name}</h3>
          <p className="muted">
            {item.category_name} · {item.color} · {item.material}
          </p>
        </div>
        <StatusBadge status={item.current_status} />
      </div>

      <dl className="ratings-grid">
        <div>
          <dt>Warmth</dt>
          <dd>{formatRating(item.warmth_rating)}</dd>
        </div>
        <div>
          <dt>Comfort</dt>
          <dd>{formatRating(item.comfort_rating)}</dd>
        </div>
        <div>
          <dt>Formality</dt>
          <dd>{formatRating(item.formality_rating)}</dd>
        </div>
      </dl>

      <div className="actions">
        {item.current_status === 'clean' && (
          <button type="button" onClick={() => onChangeStatus(item, 'worn')} disabled={isUpdating}>
            Use today
          </button>
        )}

        {item.current_status === 'worn' && (
          <button type="button" onClick={() => onChangeStatus(item, 'laundry')} disabled={isUpdating}>
            Send to laundry
          </button>
        )}

        {canMarkClean && (
          <button
            type="button"
            className="secondary-button"
            onClick={() => onChangeStatus(item, 'clean')}
            disabled={isUpdating}
          >
            Mark clean
          </button>
        )}

        {canMarkUnavailable && (
          <button
            type="button"
            className="secondary-button"
            onClick={() => onChangeStatus(item, 'unavailable')}
            disabled={isUpdating}
          >
            Mark unavailable
          </button>
        )}

        {canSendToRepair && (
          <button
            type="button"
            className="secondary-button"
            onClick={() => onChangeStatus(item, 'repair')}
            disabled={isUpdating}
          >
            Send to repair
          </button>
        )}
      </div>
    </article>
  );
}
