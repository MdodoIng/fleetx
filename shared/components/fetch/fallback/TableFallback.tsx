'use client';

import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';

import TableSkeleton from './skeleton/tableSkeloton';

export default function TableFallback() {
  return (
    <Dashboard className="h-auto sm:h-full">
      <DashboardHeader>
        <DashboardHeaderRight />
        {/* Search and Filter Skeleton */}
        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between max-sm:flex-wrap">
          <Skeleton className="h-10 w-40" /> {/* Zone Select placeholder */}
          <Skeleton className="h-10 w-40" /> {/* Year Select placeholder */}
        </div>
      </DashboardHeader>

      {/* Table Skeleton */}
      <DashboardContent className="flex-col w-full items-center">
        <TableSkeleton />
      </DashboardContent>
    </Dashboard>
  );
}
