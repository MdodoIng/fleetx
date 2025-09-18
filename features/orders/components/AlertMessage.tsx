import { Clock } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import main_padding from '@/styles/padding';
import { useNotificationStore } from '@/store';
import { useTranslations } from 'next-intl';

export default function AlertMessage({ type }: { type: 'laptop' | 'mobile' }) {
  const {
    full_day_operational,
    operationalStartTime,
    operationalEndTime,
    warningMessage,
  } = useNotificationStore();
  
  const t = useTranslations('component.features.orders');

  const shouldShowMessage = 
    !full_day_operational || 
    (warningMessage && warningMessage.isEnableToggleButton);

  if (!shouldShowMessage) return null;

  const MessageComp = () => (
    <>
      {!full_day_operational ? (
      
        <>
          <Clock className="text-dark-grey/50 w-6 h-6 flex-shrink-0" />
          <div className="flex items-center gap-1 flex-wrap">
            <p className="text-dark-grey/50 whitespace-nowrap">{t('service-hours')}:</p>
            <p className="text-dark-grey font-medium">
              {operationalStartTime} – {operationalEndTime}
            </p>
            {warningMessage?.message && (
              <>
                <span className="text-dark-grey/50">-</span>
                <p className="text-dark-grey">
                  {t('alertMessage')} {warningMessage.message}
                </p>
              </>
            )}
          </div>
        </>
      ) : (
      
        warningMessage?.message && (
          <p className="text-dark-grey text-center">
            {t('alertMessage')} {warningMessage.message}
          </p>
        )
      )}
    </>
  );

  return (
    <>
      {type === 'mobile' && (
        <div
          className={cn(
            'w-full mx-auto lg:hidden bg-[#FDFDD4] py-3 flex items-center justify-center gap-2',
            main_padding.dashboard.x
          )}
        >
          <MessageComp />
        </div>
      )}
      {type === 'laptop' && (
        <div
          className={cn(
            'max-lg:hidden bg-[#FDFDD4] py-1 px-2 rounded-full border border-[#2828281A] flex items-center justify-center gap-2 min-h-[32px]'
          )}
        >
          <MessageComp />
        </div>
      )}
    </>
  );
}