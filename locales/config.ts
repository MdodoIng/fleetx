export type Locale = (typeof locales)[number];
import messages from './translation/en.json';

export const locales = ['en', 'ar'] as const;
export const defaultLocale: Locale = 'en';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof locales)[number];
    Messages: typeof messages;
  }
}
