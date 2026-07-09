export type ClothingStatus = 'clean' | 'worn' | 'laundry' | 'unavailable' | 'repair';

export type Identity = {
  public_id: string;
  display_name: string;
  nickname: string;
  home_city?: string;
  home_country?: string;
  profile?: {
    home_city: string;
    home_country: string;
  };
};

export type CreateIdentityRequest = {
  display_name: string;
  nickname: string;
};

export type ClothingCategory = {
  id?: number | string;
  name: string;
};

export type ClothingColor = {
  name: string;
  hex_code: string;
  display_order: number;
};

export type ClothingItem = {
  id?: number | string;
  public_id?: string;
  category_name: string;
  name: string;
  color: string;
  material: string;
  image_url: string;
  warmth_rating: number;
  comfort_rating: number;
  formality_rating: number;
  rain_rating: number;
  wind_rating: number;
  current_status: ClothingStatus;
};

export type CreateClothingItemRequest = Omit<ClothingItem, 'id' | 'public_id'>;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    let detail = '';

    try {
      const body = JSON.parse(text) as { detail?: string };
      detail = body.detail ?? '';
    } catch {
      // Fall through to the raw text error below when the response is not JSON.
    }

    throw new Error(detail || text || `API request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function createIdentity(payload: CreateIdentityRequest) {
  return request<Identity>('/identities', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getIdentity(publicId: string) {
  return request<Identity>(`/identities/${publicId}`);
}

export function getIdentityByNickname(nickname: string) {
  return request<Identity>(`/identities/nickname/${encodeURIComponent(nickname)}`);
}

export async function getClothingCategories() {
  const categories = await request<Array<ClothingCategory | string>>('/clothing-categories');
  return categories.map((category) => {
    if (typeof category === 'string') {
      return { name: category };
    }

    return category;
  });
}

export function getClothingColors() {
  return request<ClothingColor[]>('/clothing-colors');
}

export function getClothingItems(publicId: string) {
  return request<ClothingItem[]>(`/identities/${publicId}/clothing-items`);
}

export function createClothingItem(publicId: string, payload: CreateClothingItemRequest) {
  return request<ClothingItem>(`/identities/${publicId}/clothing-items`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateClothingItemStatus(
  publicId: string,
  itemId: number | string,
  currentStatus: ClothingStatus,
) {
  return request<ClothingItem>(`/identities/${publicId}/clothing-items/${itemId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ current_status: currentStatus }),
  });
}
