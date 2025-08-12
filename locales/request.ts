import { getUserLocale } from '@/shared/services/locale';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.

  const locale = (await getUserLocale()) ?? 'en';

  return {
    locale,
    messages: (await import(`./translation/${locale}.json`)).default,
  };
});
