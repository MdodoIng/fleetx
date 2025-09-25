'use client';

import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import {
  Table,
  TableLists,
  TableSingleList,
  TableSingleListContent,
  TableSingleListContents,
} from '../ui/tableList';

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
        <Table>
          <TableLists>
            {Array.from({ length: 5 }).map((_, ind) => (
              <TableSingleList key={ind} className='animate-pulse opacity-45'>
                <TableSingleListContents className='animate-pulse'>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableSingleListContent key={index} className='animate-pulse'>
                      <Skeleton className="w-full h-6 mb-5 rounded-lg" />
                      <Skeleton className="w-full h-2  rounded-lg" />
                      <Skeleton className="w-full h-3 mt-1 rounded-lg" />
                      
                    </TableSingleListContent>
                  ))}
                </TableSingleListContents>
              </TableSingleList>
            ))}
          </TableLists>
        </Table>
      </DashboardContent>
    </Dashboard>
  );
}
