import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { en, type TranslationKey, vi } from './translations';

export type Language = 'vi' | 'en';

const STORAGE_KEY = 'daily-capsule-language';
const dictionaries = { vi, en } as const;

type Variables = Record<string, string | number>;

interface I18nValue {
  language: Language;
  locale: 'vi-VN' | 'en-US';
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, variables?: Variables) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function initialLanguage(): Language {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'en' || saved === 'vi' ? saved : 'vi';
}

function interpolate(template: string, variables: Variables = {}) {
  let value = template.replace(/\{\{(\w+), plural, one \{([^{}]+)\} other \{([^{}]+)\}\}\}/g, (_, name, one, other) => Number(variables[name]) === 1 ? one : other);
  value = value.replace(/\{\{(\w+)\}\}/g, (_, name) => String(variables[name] ?? ''));
  return value;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nValue>(() => ({
    language,
    locale: language === 'vi' ? 'vi-VN' : 'en-US',
    setLanguage,
    t: (key, variables) => interpolate(dictionaries[language][key], variables),
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside I18nProvider');
  return context;
}
