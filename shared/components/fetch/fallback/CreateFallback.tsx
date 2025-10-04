'use client';

import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';

export default function CreateFallback() {
  return (
    <Dashboard className="h-auto sm:h-full">
      <DashboardHeader>
        <DashboardHeaderRight />
        {/* Search and Filter Skeleton */}
        <div className="flex sm:justify-center gap-1.5 max-sm:w-full justify-between">
          <Skeleton className="h-14 w-40" /> {/* DriverSelect placeholder */}
          <Skeleton className="h-14 w-40" /> {/* DateSelect placeholder */}
        </div>
      </DashboardHeader>

      {/* Statistics Cards Skeleton */}
      <DashboardContent className="flex w-full flex-col items-center justify-start">
        <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-5 p-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="w-full rounded-lg">
              <div className="flex flex-col gap-10 p-4">
                <Skeleton className="h-10 w-8/12" />{' '}
                {/* Card title placeholder */}
                {Array.from({ length: 3 }).map((_, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex justify-between flex-col items-center space-y-10"
                  >
                    <Skeleton className="h-60 w-full" />{' '}
                    {/* Value placeholder */}
                    <Skeleton className="h-10 w-full" />{' '}
                    {/* Sub-value or icon placeholder */}
                  </div>
                ))}
              </div>
            </Skeleton>
          ))}
        </div>
      </DashboardContent>
    </Dashboard>
  );
}
