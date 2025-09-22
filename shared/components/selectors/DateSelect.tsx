import { Dispatch, SetStateAction } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations()
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
            selected={value}
            onSelect={(value) =>
              onChangeAction({
                from: value?.from as Date,
                to: value?.to as Date,
              })
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        className={cn(
          value?.to ? 'text-primary-blue cursor-pointer' : 'pointer-events-none'
        )}
        onClick={() => console.log('Apply with:', value)}
      >
        Apply
      </Button>
    </div>
  );
}

export default DateSelect;
