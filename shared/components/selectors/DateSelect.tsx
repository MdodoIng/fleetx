'use client';
import { Dispatch, SetStateAction } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { DateRange } from 'react-day-picker';

type Props = {
  value?: DateRange;
  onChangeAction: Dispatch<SetStateAction<DateRange>>;
};

function DateSelect({ value, onChangeAction }: Props) {
  const t = useTranslations();

  const handleDateSelect = (newDate: DateRange) => {
    if (newDate?.from && newDate?.to) {
      onChangeAction({
        from: newDate.from,
        to: newDate.to,
      });
    } else if (newDate?.from) {
      onChangeAction({
        from: newDate.from,
        to: newDate.from,
      });
    } else {
      onChangeAction({
        from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        to: new Date(),
      });
    }
  };

  return (
    <div className="flex items-center relative bg-white rounded-[8px] max-sm:w-full">
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
            <CalendarIcon className="h-4 w-4 mr-2" />
            {value?.from ? (
              value?.to && value.from !== value.to ? (
                <>
                  {format(value.from, 'PP')} - {format(value.to, 'PP')}
                </>
              ) : (
                format(value.from, 'PP')
              )
            ) : (
              <span>
                {t('component.features.orders.history.search.dateRange')}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 pr-10 relative "
          align="start"
          side="bottom"
        >
          <Calendar
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            required
          />
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        className=""
        onClick={() => onChangeAction({ from: undefined, to: undefined })}
      >
        {t('component.features.orders.history.search.clear')}
      </Button>
    </div>
  );
}

export default DateSelect;
