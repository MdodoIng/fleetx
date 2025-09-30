'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import DateSelect from '@/shared/components/selectors/DateSelect';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/shared/components/ui/card';
import { DateRange } from 'react-day-picker';
import { InsightsFallback } from '@/shared/components/fetch/fallback';

interface ChurnReason {
  reason: string;
  total: number;
}

function ChurnReasons() {
  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    to: new Date(),
  });
  const [churnReasons, setChurnReasons] = useState<ChurnReason[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChurnReasonsData = useCallback(
    async (callback?: () => void) => {
      try {
        const response = await reportService.getChurnReasonsInsights(
          date?.from ?? null,
          date?.to ?? null
        );

        const mapped: ChurnReason[] = CHURN_REASONS.map((reason) => {
          const match = response?.data?.find(
            (x: { reason: string; total: number }) => x.reason === reason.id
          );
          return {
            reason: reason.name,
            total: match?.total || 0,
          };
        });

        setChurnReasons(mapped);
        if (callback) {
          callback();
        }
      } catch (error) {
        console.error('Error fetching churn reasons data:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [date?.from, date?.to]
  );

  useEffect(() => {
    fetchChurnReasonsData();
  }, [fetchChurnReasonsData]);

  if (isLoading) return <InsightsFallback />;

  return (
    <Dashboard className="h-auto sm:h-full">
      <DashboardHeader>
        <DashboardHeaderRight />

        <DateSelect value={date} onChangeAction={setDate} />
      </DashboardHeader>

      {/* Statistics Cards */}
      <DashboardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {churnReasons.map((item, idx) => (
          <Card key={idx} className="py-4">
            <CardContent className="gap-6 flex flex-col px-4">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className={cn('text-sm opacity-70')}>
                  {item.reason}
                </CardTitle>
              </div>
              <CardContent className="px-0">
                <CardDescription className={cn('text-2xl font-medium')}>
                  {item.total}
                </CardDescription>
              </CardContent>
            </CardContent>
          </Card>
        ))}
      </DashboardContent>
    </Dashboard>
  );
}

export default ChurnReasons;
