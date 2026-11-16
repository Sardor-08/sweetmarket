export type Locale = 'uz' | 'ru';

export type ThemeMode = 'light' | 'dark';

export interface LocalizedText {
  uz: string;
  ru: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
  district: string;
  address: string;
}

export interface MoneyAmount {
  amount: number;
  currency: 'UZS';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  nextCursor: string | null;
}
