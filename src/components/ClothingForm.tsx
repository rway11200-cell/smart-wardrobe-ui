import { FormEvent, useEffect, useState } from 'react';
import {
  ClothingCategory,
  ClothingColor,
  CreateClothingItemRequest,
  createClothingItem,
} from '../api/client';

type ClothingFormProps = {
  identityPublicId: string;
  categories: ClothingCategory[];
  colors: ClothingColor[];
  onCreated: () => void;
};

const initialForm: CreateClothingItemRequest = {
  category_name: 'top',
  name: '',
  color: '',
  material: '',
  image_url: '',
  warmth_rating: 0.5,
  comfort_rating: 0.8,
  formality_rating: 0.3,
  rain_rating: 0.2,
  wind_rating: 0.3,
  current_status: 'clean',
};

export function ClothingForm({ identityPublicId, categories, colors, onCreated }: ClothingFormProps) {
  const [form, setForm] = useState<CreateClothingItemRequest>(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && form.category_name === initialForm.category_name) {
      updateField('category_name', categories[0].name);
    }
  }, [categories, form.category_name]);

  useEffect(() => {
    if (colors.length > 0 && form.color === initialForm.color) {
      updateField('color', colors[0].name);
    }
  }, [colors, form.color]);

  function updateField<K extends keyof CreateClothingItemRequest>(
    field: K,
    value: CreateClothingItemRequest[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await createClothingItem(identityPublicId, form);
      setForm({
        ...initialForm,
        category_name: categories[0]?.name ?? initialForm.category_name,
        color: colors[0]?.name ?? initialForm.color,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create clothing item.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <h2>Add clothing item</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Category
            <select
              value={form.category_name}
              onChange={(event) => updateField('category_name', event.target.value)}
            >
              {(categories.length > 0 ? categories : [{ name: 'top' }]).map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Black hoodie"
              required
            />
          </label>

          <label>
            Color
            <select
              value={form.color}
              onChange={(event) => updateField('color', event.target.value)}
              required
            >
              {colors.length === 0 && <option value="">No colors available</option>}
              {colors.map((color) => (
                <option key={color.name} value={color.name}>
                  {color.name}
                </option>
              ))}
            </select>
            {form.color && <ColorPreview color={colors.find((color) => color.name === form.color)} />}
          </label>

          <label>
            Material
            <input
              value={form.material}
              onChange={(event) => updateField('material', event.target.value)}
              placeholder="cotton"
              required
            />
          </label>

          <label>
            Image URL
            <input
              value={form.image_url}
              onChange={(event) => updateField('image_url', event.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </label>
        </div>

        <div className="slider-grid">
          <RatingInput label="Warmth" value={form.warmth_rating} onChange={(value) => updateField('warmth_rating', value)} />
          <RatingInput label="Comfort" value={form.comfort_rating} onChange={(value) => updateField('comfort_rating', value)} />
          <RatingInput label="Formality" value={form.formality_rating} onChange={(value) => updateField('formality_rating', value)} />
          <RatingInput label="Rain" value={form.rain_rating} onChange={(value) => updateField('rain_rating', value)} />
          <RatingInput label="Wind" value={form.wind_rating} onChange={(value) => updateField('wind_rating', value)} />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add item'}
        </button>
      </form>
    </section>
  );
}

type ColorPreviewProps = {
  color: ClothingColor | undefined;
};

function ColorPreview({ color }: ColorPreviewProps) {
  if (!color) {
    return null;
  }

  return (
    <span className="color-preview">
      <span className="color-swatch" style={{ backgroundColor: color.hex_code }} />
      {color.hex_code}
    </span>
  );
}

type RatingInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function RatingInput({ label, value, onChange }: RatingInputProps) {
  return (
    <label>
      <span>
        {label}: {Math.round(value * 100)}%
      </span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
