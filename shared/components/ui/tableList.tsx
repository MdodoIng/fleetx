import React from 'react';

import { cn } from '@/shared/lib/utils';

function Table({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="table" className={cn('w-full', className)} {...props} />
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-header"
      className={cn(
        'flex items-start justify-between flex-wrap sm:gap-x-10 gap-x-6 gap-y-4 w-full ',
        className
      )}
      {...props}
    />
  );
}

function TableLists({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-lists"
      className={cn('space-y-4', className)}
      {...props}
    />
  );
}
function TableSingleList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-single-list"
      className={cn(
        'bg-white rounded-lg shadow p-4 flex flex-col border border-gray-100 overflow-hidden',
        className
      )}
      {...props}
    />
  );
}

function TableSingleListHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-single-list-header"
      className={cn(
        'flex justify-between items-start mb-3 overflow-x-auto shrink-0 w-full gap-10',
        className
      )}
      {...props}
    />
  );
}

function TableSingleListHeaderRight({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-single-list-header-right"
      className={cn('flex items-center shrink-0 gap-1.5', className)}
      {...props}
    />
  );
}
function TableSingleListHeaderLeft({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-single-list-header-left"
      className={cn(
        'flex justify-between shrink-0 items-center  text-xs text-dark-grey/75 gap-1.5',
        className
      )}
      {...props}
    />
  );
}

function TableSingleListContents({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-single-list-contents"
      className={cn(
        'md:grid flex grid-cols-[repeat(auto-fit,minmax(120px,1fr))] w-full overflow-x-auto gap-4 text-sm',
        className
      )}
      {...props}
    />
  );
}

function TableSingleListContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-single-list-content"
      className={cn(
        'flex flex-col p-3 shrink-0 relative z-0 rounded-[8px] border border-dark-grey/10  max-md:max-w-[150px]',
        className
      )}
      {...props}
    />
  );
}

function TableSingleListContentTitle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-single-list-content-title"
      className={cn(
        'text-dark-grey/70 flex items-center gap-1 [&_svg]:text-primary-blue mb-2',
        className
      )}
      {...props}
    />
  );
}

function TableSingleListContentDetailsTitle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-single-list-content-details-title"
      className={cn('text-sm font-medium text-dark-grey', className)}
      {...props}
    />
  );
}
function TableSingleListContentDetailsItem({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-single-list-content-details-item"
      className={cn('text-xs text-[#1D1B20] flex items-center gap-1', className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableSingleListHeader,
  TableLists,
  TableSingleList,
  TableSingleListHeaderRight,
  TableSingleListHeaderLeft,
  TableSingleListContents,
  TableSingleListContent,
  TableSingleListContentTitle,
  TableSingleListContentDetailsTitle,
  TableSingleListContentDetailsItem
};
