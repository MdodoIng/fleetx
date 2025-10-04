import { cn } from '@/shared/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-black/5  animate-pulse rounded-[8px] ', className)}
      {...props}
    />
  );
}

export { Skeleton };
