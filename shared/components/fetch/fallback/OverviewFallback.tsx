'use client';

import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Card, CardContent } from '@/shared/components/ui/card';

export default function OverviewFallback() {
  return (
    <Dashboard className="h-auto sm:h-full">
      <DashboardHeader>
        <DashboardHeaderRight />
        {/* Search and Filter Skeleton */}
        <div className="flex sm:justify-center gap-1.5 max-sm:w-full justify-between">
          <Skeleton className="h-10 w-40" /> {/* DateSelect placeholder */}
          <Skeleton className="h-10 w-24 rounded-lg" />{' '}
          {/* Export Button placeholder */}
        </div>
      </DashboardHeader>

      {/* Statistics Cards Skeleton */}
      <DashboardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* InsightTiles Skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <Card key={index} className="py-4">
              <CardContent className="flex flex-col h-full gap-4 px-4">
                <Skeleton className="h-6 w-20" /> {/* Title placeholder */}
                <Skeleton className="h-8 w-16 mt-auto" />{' '}
                {/* Count placeholder */}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FunnelChart Skeleton */}
        <Card className="flex items-center justify-center h-full">
          <CardContent className="space-y-6 flex flex-col items-center justify-center">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-20 w-full max-w-[calc(100%-100px)] mx-auto rounded-full flex items-center justify-between px-10 py-2"
              >
                <div className="flex justify-between w-full">
                  <Skeleton className="h-4 w-16" /> {/* Title placeholder */}
                  <Skeleton className="h-4 w-12" /> {/* Count placeholder */}
                </div>
                <Skeleton className="h-4 w-12 absolute right-0" />{' '}
                {/* Percentage placeholder */}
              </Skeleton>
            ))}
          </CardContent>
        </Card>
      </DashboardContent>
    </Dashboard>
  );
}
