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
import { DayPicker } from 'react-day-picker';


type DateRange = {
  from: Date;
  to: Date;
};

type Props = {
  value?: DateRange;
  setDate: Dispatch<SetStateAction<DateRange>>;
};

function DateSelect({ value, setDate }: Props) {
  const t = useTranslations();

  console.log(value);
  const handleDateSelect = (newDate: DateRange) => {
    if (newDate?.from && newDate?.to) {
      setDate({
        from: newDate.from,
        to: newDate.to,
      });
    } else if (newDate?.from) {
      setDate({
        from: newDate.from,
        to: newDate.from,
      });
    } else {
      setDate({
        from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        to: new Date(),
      });
    }
  };

  return (
    <div className="flex items-center gap-2 relative bg-white rounded-[8px] max-sm:w-full">
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
        <PopoverContent className="w-auto p-0" align="start" side="bottom">
          <Calendar
            mode="range"
            defaultMonth={value?.from}
            selected={{
              from: value?.from,
              to: value?.to,
            }}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateSelect;
