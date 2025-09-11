
import main_padding from '@/styles/padding';
import { Icon } from '@iconify/react';
import { StarIcon } from 'lucide-react';
import bgBox from '@/assets/images/promo banner box.webp';
import Image from 'next/image';
import { useFormatter, useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';

export default function PromoBanner() {
  const t = useTranslations('auth.promoBanner');
  const promoPoints = [
    { icon: 'wpf:fastforward', text: t('features.pickup') },
    { icon: 'heroicons:map-pin-16-solid', text: t('features.tracking') },
    {
      icon: 'material-symbols:groups-outline',
      text: t('features.drivers'),
    },
    {
      icon: 'simple-icons:googletranslate',
      text: t('features.support'),
    },
    { icon: 'charm:tick', text: t('features.noFees') },
  ];


  return (
    <div
      className={cn(
        'w-full flex flex-col items-start h-full justify-start  relative z-0',
        main_padding.x,
        main_padding.y
      )}
    >
      <div className="text-sm text-off-white flex items-center gap-3 bg-black/25 px-4 py-3 rounded-full max-[400px]:w-full max-[400px]:text-xs max-[400px]:px-2 max-[400px]:py-2">
        <StarIcon
          width={16}
          height={16}
          className="fill-soft-yellow text-soft-yellow"
        />{' '}
        {t('badge')}
      </div>

      <h2 className="md:text-4xl text-2xl font-semibold leading-snug mt-6 text-white [&_span]:text-soft-yellow max-md:max-w-[80%]">
        {t.rich('headlineRich', {
          span: (chunks) => <span>{chunks}</span>,
        })}
      </h2>
      <h3 className="text-off-white mt-2 max-md:max-w-[80%]">{t('subHeadline')}</h3>

      <ul className="pb-6 space-y-2 text-sm text-off-white my-auto max-md:hidden">
        {promoPoints.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <span className="bg-black/25 aspect-square size-7 rounded-full flex">
              <Icon
                icon={item.icon}
                width={14}
                height={14}
                className="m-auto"
              />
            </span>
            {item.text}
          </li>
        ))}
      </ul>

      <div className="mt-auto max-md:pt-20 text-off-white flex max-[400px]:flex-col gap-4 items-start justify-between w-full">
        <div className="grid">
          <p className="font-semibold text-base ">{t('contact.title')}</p>
          <span className="text-sm">{t('contact.subtitle')}</span>
        </div>
        <a
          href="tel:+96522345678"
          className="bg-black/30 px-6 py-3 rounded-full font-english max-[400px]:w-full text-center"
        >
          {t('contact.phone')}
        </a>
      </div>

      <Image
        src={bgBox}
        alt=""
        priority
        placeholder="blur"
        className="absolute md:h-[50%] h-[200px]  w-auto object-contain top-1/2 ltr:-translate-y-1/2 -z-10 ltr:right-0 rtl:left-0 rtl:-translate-y-1/2"
      />
    </div>
  );
}
