import { useEffect, useState } from 'react';
import {
  ClothingCategory,
  ClothingItem,
  ClothingStatus,
  Identity,
  getClothingCategories,
  getClothingItems,
  getIdentity,
  updateClothingItemStatus,
} from '../api/client';
import { ClothingCard } from '../components/ClothingCard';
import { ClothingForm } from '../components/ClothingForm';

type WardrobePageProps = {
  identityPublicId: string;
  onClearIdentity: () => void;
};

type WardrobeSection = {
  title: string;
  statuses: ClothingStatus[];
};

const sections: WardrobeSection[] = [
  { title: 'Available / clean', statuses: ['clean'] },
  { title: 'Worn', statuses: ['worn'] },
  { title: 'Laundry', statuses: ['laundry'] },
  { title: 'Unavailable / Repair', statuses: ['unavailable', 'repair'] },
];

export function WardrobePage({ identityPublicId, onClearIdentity }: WardrobePageProps) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [categories, setCategories] = useState<ClothingCategory[]>([]);
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<string | number | null>(null);

  async function loadWardrobe() {
    setError('');

    try {
      const [identityResponse, categoriesResponse, itemsResponse] = await Promise.all([
        getIdentity(identityPublicId),
        getClothingCategories(),
        getClothingItems(identityPublicId),
      ]);

      setIdentity(identityResponse);
      setCategories(categoriesResponse);
      setItems(itemsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load wardrobe.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadWardrobe();
  }, [identityPublicId]);

  async function handleChangeStatus(item: ClothingItem, status: ClothingStatus) {
    const itemId = item.id ?? item.public_id;

    if (!itemId) {
      setError('This clothing item does not include an id or public_id.');
      return;
    }

    setUpdatingItemId(itemId);
    setError('');

    try {
      await updateClothingItemStatus(identityPublicId, itemId, status);
      await loadWardrobe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update item status.');
    } finally {
      setUpdatingItemId(null);
    }
  }

  return (
    <main className="page">
      <header className="app-header">
        <div>
          <p className="eyebrow">Smart Wardrobe</p>
          <h1>{identity ? `${identity.display_name}'s wardrobe` : 'Wardrobe'}</h1>
          {identity && (
            <p className="muted">
              {identity.home_city}, {identity.home_country}
            </p>
          )}
        </div>

        <button type="button" className="secondary-button" onClick={onClearIdentity}>
          Clear current identity
        </button>
      </header>

      {error && <p className="error">{error}</p>}
      {isLoading && <p className="muted">Loading wardrobe...</p>}

      {!isLoading && (
        <>
          <ClothingForm
            identityPublicId={identityPublicId}
            categories={categories}
            onCreated={loadWardrobe}
          />

          <section className="wardrobe-sections">
            {sections.map((section) => {
              const sectionItems = items.filter((item) => section.statuses.includes(item.current_status));

              return (
                <div className="panel" key={section.title}>
                  <div className="section-heading">
                    <h2>{section.title}</h2>
                    <span className="count-pill">{sectionItems.length}</span>
                  </div>

                  {sectionItems.length === 0 ? (
                    <p className="muted">No items in this section.</p>
                  ) : (
                    <div className="cards-grid">
                      {sectionItems.map((item) => {
                        const itemId = item.id ?? item.public_id ?? item.name;

                        return (
                          <ClothingCard
                            key={itemId}
                            item={item}
                            onChangeStatus={handleChangeStatus}
                            isUpdating={updatingItemId === itemId}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}
