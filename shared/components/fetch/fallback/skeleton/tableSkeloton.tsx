'use client';

import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Table,
  TableLists,
  TableSingleList,
  TableSingleListContent,
  TableSingleListContents,
} from '@/shared/components/ui/tableList';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({
  rows = 5,
  columns = 5,
}: TableSkeletonProps) {
  return (
    <Table>
      <TableLists>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableSingleList key={rowIndex} className="animate-pulse opacity-45">
            <TableSingleListContents className="animate-pulse">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableSingleListContent
                  key={colIndex}
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
  );
}
