import { useContext } from 'react';
import { I18nContext, I18nContextValue } from '../app/providers/I18nProvider';

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used inside I18nProvider');
  }
  return ctx;
}
