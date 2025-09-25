import { getUserLocale } from '@/shared/services/locale';
import { useSharedStore } from '@/store';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './config';

// @ts-expect-error
export default getRequestConfig(async () => {
  const { showLanguage } = useSharedStore.getState();

  const locale = showLanguage
    ? ((await getUserLocale()) ?? defaultLocale)
    : defaultLocale;

  return {
    locale,
    messages: (await import(`./translation/${locale}.json`)).default,
  };
});
