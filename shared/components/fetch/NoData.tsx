'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '../../lib/utils';

interface NoDataProps {
  message?: string;
  onRefresh?: () => void;
  className?: string;
  size?: 'small' | 'larg';
}

export default function NoData({
  message = 'Whoops! No data found',
  onRefresh,
  className,
  size = 'larg',
}: NoDataProps) {
  return (
    <Card
      className={cn('w-full ', size === 'small' && 'py-2', className)}
    >
      <CardContent
        className={cn(
          'flex flex-col items-center justify-center  h-full ',
          size === 'larg' && 'min-h-[200px] px-6'
        )}
      >
        <AlertTriangle
          className={cn(
            ' text-off-white ',
            size === 'small' && 'size-8 mb-2',
            size === 'larg' && 'size-16 mb-4'
          )}
        />
        <p
          className={cn(
            'text-center text-dark-grey  font-medium ',
            size === 'larg' && 'text-lg mb-4'
          )}
        >
          {message}
        </p>
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
