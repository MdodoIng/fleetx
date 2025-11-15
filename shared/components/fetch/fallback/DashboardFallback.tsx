'use client';

import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';

export default function DashboardFallback() {
  return (
    <Dashboard transition={{ duration: 0.5 }} className="">
      <DashboardHeader>
        <DashboardHeaderRight />
        {/* Search and Filter Skeleton */}
        <div className="flex sm:justify-center gap-1.5 max-sm:w-full justify-between ">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </DashboardHeader>

      {/* Statistics Cards Skeleton */}
      <DashboardContent className="flex w-full h-full flex-col items-center justify-start">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-lg" />
          ))}
        </div>

        {/* Analytics Blocks Skeleton */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]  h-full w-full gap-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-80 w-full rounded-lg">
              <div className="flex flex-col gap-3 p-4">
                <Skeleton className="h-4 w-1/3" />
                {Array.from({ length: 3 }).map((_, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex justify-between items-center"
                  >
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/6" />
                  </div>
                ))}
                {index === 1 && (
                  <>
                    <Skeleton className="h-px w-full my-2" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/6" />
                    </div>
                  </>
                )}
              </div>
            </Skeleton>
          ))}
        </div>
      </DashboardContent>
    </Dashboard>
  );
}
