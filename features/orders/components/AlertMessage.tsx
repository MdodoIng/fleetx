import { Clock } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import main_padding from '@/styles/padding';
import { useNotificationStore } from '@/store';
import { useTranslations } from 'next-intl';

export default function AlertMessage({ type }: { type: 'laptop' | 'mobile' }) {
  const { full_day_operational, operationalStartTime, operationalEndTime } =
    useNotificationStore();

  const t = useTranslations('component.features.orders');
  if (full_day_operational) return;
  return (
    <>
      {type === 'mobile' && (
        <div
          className={cn(
            'w-full mx-auto lg:hidden bg-[#FDFDD4] py-3 flex items-center justify-center gap-2',

            main_padding.dashboard.x
          )}
        >
          <Clock className="text-dark-grey/50 w-6 h-6" />
          <div className="flex items-center gap-1">
            <p className=" text-dark-grey/50">{t('alertMessage')}</p>
            <p className=" text-dark-grey">
              {operationalStartTime} – {operationalEndTime}
            </p>
          </div>
        </div>
      )}
      {type === 'laptop' && (
        <div
          className={cn(
            'max-lg:hidden bg-[#FDFDD4] py-1 px-2 rounded-full border border-[#2828281A] flex items-center justify-center gap-2'
          )}
        >
          <Clock className="text-dark-grey/50 size-4" />
          <div className="flex items-center gap-2">
            <p className=" text-dark-grey">{t('alertMessage')}</p>
            <p className=" text-dark-grey font-medium">
              {operationalStartTime} – {operationalEndTime}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
