/** eslint-disable react-hooks/exhaustive-deps */
/** eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Flower } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Dispatch, JSX, SetStateAction, useEffect, useRef } from 'react';
import TableSkeleton from './fallback/skeleton/tableSkeloton';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';

interface NoDataProps {
  setPage: Dispatch<SetStateAction<number>>;
  nextSetItemTotal?: unknown | null;
  count?: number;
  loadMoreNumber?: number;
  className?: string;
  type?: 'table' | 'normal' | 'skeleton-small';
}

export default function LoadMore({
  nextSetItemTotal = null,
  count = 0,
  loadMoreNumber = 0,
  className,
  setPage,
  type = 'normal',
}: NoDataProps) {
  const observerRef = useRef<HTMLDivElement>(null);
  const hasMore = nextSetItemTotal !== null || count < loadMoreNumber;


  const skeltons: Record<typeof type, JSX.Element> = {
    table: <TableSkeleton columns={4} rows={1} />,
    normal: (
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    ),
    'skeleton-small': (
      <Skeleton className="h-10 text-center flex items-center justify-center text-dark-grey/30">
        Loading
      </Skeleton>
    ),
  };

  useEffect(() => {
    if (hasMore) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prev) => prev + 10);
          }
        },
        { threshold: 0.1 }
      );
      if (observerRef.current) {
        observer.observe(observerRef.current);
      }
      return () => {
        if (observerRef.current) {
          observer.unobserve(observerRef.current);
        }
      };
    }
  }, [hasMore]);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center w-full ',
        !hasMore ? '' : 'p-0',
        className
      )}
    >
      {!hasMore ? (
        <div
          className={cn(
            'flex items-center justify-center w-1/4 py-4 shrink-0 gap-4',
            type === 'skeleton-small' && 'gap-2'
          )}
        >
          <Separator
            className={cn(
              type === 'skeleton-small' && 'border-[0.5px] border-dark-grey/5'
            )}
          />
          <Flower className="size-4  text-dark-grey/20 shrink-0" />
          <Separator
            className={cn(
              type === 'skeleton-small' && 'border-[0.5px] border-dark-grey/5'
            )}
          />
        </div>
      ) : (
        <div className="w-full" ref={observerRef}>
          {skeltons[type]}
        </div>
      )}
    </div>
  );
}
