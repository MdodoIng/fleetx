'use client';

import React, { useState } from 'react';
import TableComponent from '@/features/vendor/components/list/TableComponent';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Download } from 'lucide-react';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import InsightTiles from '@/features/insights/components/overview/InsightTiles';
import FunnelChart from '@/features/insights/components/overview/FunnelChart';
import useInsightBoard from '@/features/insights/hooks/useInsightBoard';

interface DateRange {
  from?: Date;
  to?: Date;
}

function Overview() {
  const [date, setDate] = useState<DateRange>();

  const {
    selectedFromDate,
    selectedToDate,
    setSelectedFromDate,
    setSelectedToDate,
    metrics,
  } = useInsightBoard();

  const { exportOrdersToCSV } = useTableExport();

  const handleDateSelect = (range: DateRange) => {
    setDate(range);
    if (range?.from) setSelectedFromDate(range.from);
    if (range?.to) setSelectedToDate(range.to);
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 p-4">
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
                onSelect={handleDateSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            className="text-primary"
            onClick={() => {
              setSelectedFromDate(date.from!);
              setSelectedToDate(date.to!);
            }}
          >
            Apply
          </Button>
        </div>

        <Button className="p-2 hover:bg-gray-100 rounded-lg">
          <Download className="w-5 h-5" /> Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightTiles
          metrics={[
            { title: 'Sign ups', count: metrics.totalSignups },
            { title: 'Total Recharges', count: metrics.totalRecharges },
            {
              title: 'Total First Time Recharges',
              count: metrics.totalFirstTimeRecharges,
            },
            { title: 'Total Orders', count: metrics.totalOrders },
            {
              title: 'Total First Time Orders',
              count: metrics.totalFirstTimeOrders,
            },
            {
              title: 'Total Funnel Activated',
              count: metrics.totalFunnelActivated,
            },
            { title: 'Active Count', count: metrics.activeBranchCount },
            { title: 'Inactive Count', count: metrics.inactiveBranchCount },
            {
              title: 'Reactivated Count',
              count: metrics.reactivatedFunnelCount,
            },
            {
              title: 'UpToDate Active Count',
              count: metrics.upToDateActiveCount,
              highlight: true,
            },
          ]}
        />
        <FunnelChart
          data={[
            { title: 'Signed up', count: metrics.totalSignups },
            {
              title: 'First Wallet Recharge',
              count: metrics.firstWalletRecharges,
              percentage: metrics.firstWalletRechargesPercentage,
            },
            {
              title: 'Activated',
              count: metrics.totalActivated,
              percentage: metrics.totalActivatedPercentage,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default Overview;
