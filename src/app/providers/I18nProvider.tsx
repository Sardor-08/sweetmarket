import React, { createContext, useCallback, useEffect, useState } from 'react';
import { DICTIONARIES, TranslationDictionary } from '../../i18n';
import { Locale } from '../../types';

const LOCALE_STORAGE_KEY = 'sweetmarket_locale';

export interface I18nContextValue {
  locale: Locale;
  t: TranslationDictionary;
  setLocale: (locale: Locale) => void;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

function resolveInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'uz';
  }
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === 'uz' || saved === 'ru') {
      return saved;
    }
  } catch {
    // Ignore storage read failure
  }
  return 'uz';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(resolveInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore storage write failure
    }
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  return (
    <I18nContext.Provider
      value={{
        locale,
        t: DICTIONARIES[locale],
        setLocale,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}
