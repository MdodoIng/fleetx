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
      data-slot="dashboard-header"
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
      className={cn('space-y-6', className)}
      {...props}
    />
  );
}
function TableSigleList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-sigle-list"
      className={cn(
        'bg-white rounded-lg shadow p-4 flex flex-col border border-gray-100',
        className
      )}
      {...props}
    />
  );
}

function TableSigleListHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-sigle-list-header"
      className={cn('flex justify-between items-start mb-3', className)}
      {...props}
    />
  );
}

function TableSigleListHeaderRight({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-sigle-list-header-right"
      className={cn('flex items-center gap-1.5', className)}
      {...props}
    />
  );
}
function TableSigleListHeaderLeft({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-sigle-list-header-left"
      className={cn(
        'flex justify-between items-center  text-xs text-dark-grey/75 gap-1.5',
        className
      )}
      {...props}
    />
  );
}

function TableSigleListContents({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-sigle-list-contents"
      className={cn(
        'grid md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] w-full gap-4 text-sm',
        className
      )}
      {...props}
    />
  );
}

function TableSigleListContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="table-sigle-list-contents"
      className={cn(
        'flex flex-col p-3 rounded-lg border bg-gray-50',
        className
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableSigleListHeader,
  TableLists,
  TableSigleList,
  TableSigleListHeaderRight,
  TableSigleListHeaderLeft,
  TableSigleListContents,
  TableSigleListContent,
};
