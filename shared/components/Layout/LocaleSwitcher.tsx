import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher({ variant }: {  variant?: "normal" | "dashboard"; }) {
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: 'en',
          label: 'english',
        },
        {
          value: 'ar',
          label: 'عربي',
        },
      ]}
      label={'languages'}
      variant={variant}
    />
  );
}
