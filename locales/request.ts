import { getUserLocale } from '@/shared/services/locale';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = (await getUserLocale()) ?? 'en';

  return {
    locale,
    messages: (await import(`./translation/${locale}.json`)).default,
  };
});
