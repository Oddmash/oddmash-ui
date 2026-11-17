import { createContext, useContext, type ReactNode } from 'react';
import { translations } from './translations';

export const languages = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  'zh-CN': '简体中文',
} as const;

export type Locale = keyof typeof languages;
type Translate = (text: string) => string;

const LocaleContext = createContext<{ locale: Locale; t: Translate }>({
  locale: 'en',
  t: (text) => text,
});

export const LocaleProvider = ({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) => (
  <LocaleContext.Provider
    value={{
      locale,
      t: (text) => {
        const values = translations[text];
        return locale === 'en'
          ? text
          : (values?.[{ ko: 0, ja: 1, 'zh-CN': 2 }[locale]] ?? text);
      },
    }}
  >
    {children}
  </LocaleContext.Provider>
);

export const useLocale = () => useContext(LocaleContext);

export const readLocale = (): Locale => {
  try {
    const stored = localStorage.getItem('om-docs-locale');
    if (stored && Object.hasOwn(languages, stored)) return stored as Locale;
  } catch {
    return 'en';
  }
  return 'en';
};
