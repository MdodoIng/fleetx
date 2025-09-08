'use client';

import React, { useState, useEffect } from 'react';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import { reportService } from '@/shared/services/report';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { CHURN_REASONS } from '@/shared/constants/storageConstants';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface ChurnReason {
  reason: string;
  total: number;
}

function ChurnReasons() {
  const [date, setDate] = useState<DateRange>();
  const [churnReasons, setChurnReasons] = useState<ChurnReason[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChurnReasonsData = async () => {
    setIsLoading(true);
    try {
      const response = await reportService.getChurnReasonsInsights(
        date?.from!,
        date?.to!
      );

      const mapped: ChurnReason[] = CHURN_REASONS.map((reason) => {
        const match = response?.data?.find((x: any) => x.reason === reason.id);
        return {
          reason: reason.name,
          total: match?.total || 0,
        };
      });

      setChurnReasons(mapped);
    } catch (error) {
      console.error('Error fetching churn reasons data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChurnReasonsData();
  }, [date]);

  return (
    <div className="lockcard-page flex flex-col items-center bg-gray-50 p-4">
      <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-[280px] justify-start text-left font-normal',
                  !date?.from && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date?.to ? (
                    <>
                      From {format(date.from, 'PP')} - To{' '}
                      {format(date.to, 'PP')}
                    </>
                  ) : (
                    format(date.from, 'PPP')
                  )
                ) : (
                  <span>From Date - To Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 flex">
              <Calendar
                autoFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(range) => {
                  if (range?.from && range?.to && range.from > range.to) {
                    alert('To date should be greater than from date');
                    return;
                  }
                  setDate(range as DateRange);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            className="text-primary"
            onClick={fetchChurnReasonsData}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Apply'}
          </Button>
        </div>
      </div>

      <div className="insight-tiles-main w-full max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {churnReasons.map((item, idx) => (
            <div
              key={idx}
              className="insight-tile p-4 rounded-xl shadow-md bg-white text-center"
            >
              <span className="count text-[48px] font-bold text-[#30d9c4] block">
                {item.total}
              </span>
              <span className="title text-[14px] font-semibold text-[#30d9c4] mt-2 block">
                {item.reason}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuth(ChurnReasons, [
  'FINANCE_MANAGER',
  'OPERATION_MANAGER',
  'VENDOR_ACCOUNT_MANAGER',
  'SALES_HEAD',
]);
