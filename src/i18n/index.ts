import { Locale } from '../types';
import { ru } from './ru';
import { TranslationDictionary } from './types';
import { uz } from './uz';

export const DICTIONARIES: Record<Locale, TranslationDictionary> = {
  uz,
  ru,
};

export type { TranslationDictionary };
