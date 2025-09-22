'use client';
import { Dispatch, SetStateAction } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

import { CalendarIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { Calendar } from '@/shared/components/ui/calendar';

type Props = {
  value?: {
    from: Date;
    to: Date;
  };
  onChangeAction: Dispatch<
    SetStateAction<{
      from?: Date;
      to?: Date;
    }>
  >;
};

function DateSelect({ value, onChangeAction }: Props) {
  const t = useTranslations();

  const handleDateSelect = (newDate: typeof value) => {
    if (newDate) {
      onChangeAction(newDate);
    } else {
      onChangeAction({ from: undefined, to: undefined });
    }
  };

  return (
    <div className="flex items-center gap-2 relative z-0 bg-white rounded-[8px] max-sm:w-full">
      <Popover>
        <PopoverTrigger
          asChild
          className="!ring-0 border-none text-dark-grey max-sm:w-full shrink"
        >
          <Button
            id="date"
            variant={'outline'}
            className={cn(' justify-start text-left font-normal')}
          >
            <CalendarIcon className=" h-4 w-4" />
            {value?.from ? (
              value?.to ? (
                <>
                  {format(value.from, 'PP')} - {format(value.to, 'PP')}
                </>
              ) : (
                format(value.from, 'PPP')
              )
            ) : (
              <span>
                {t('component.features.orders.history.search.dateRange')}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={value?.from}
            // @ts-ignore
            selected={value}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateSelect;
