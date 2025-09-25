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
import {
    Card,
    CardContent,
    CardDescription,
    CardIcon
} from '../ui/card';

export default function InsightsFallback() {
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
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 w-full">
          {Array.from({ length: 5 }).map((_, ind) => (
            <Card key={ind} className="py-4 animate-pulse opacity-45">
              <CardContent className="gap-14 flex flex-col px-4">
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="w-full h-3  rounded-lg" />

                  <CardIcon>
                    <Skeleton className=" size-6  rounded-lg" />
                  </CardIcon>
                </div>
                <CardContent className="px-0">
                  <CardDescription className={'text-2xl font-medium'}>
                    <Skeleton className="w-full h-6  rounded-lg" />
                  </CardDescription>
                </CardContent>
              </CardContent>
            </Card>
          ))}
        </div>
        <Table>
          <TableLists>
            {Array.from({ length: 5 }).map((_, ind) => (
              <TableSingleList key={ind} className="animate-pulse opacity-45">
                <TableSingleListContents className="animate-pulse">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableSingleListContent
                      key={index}
                      className="animate-pulse"
                    >
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
