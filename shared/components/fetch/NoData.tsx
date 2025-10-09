'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '../../lib/utils';
import { useTranslations } from 'next-intl';

interface NoDataProps {
  message?: string;
  onRefresh?: () => void;
  className?: string;
  size?: 'small' | 'large';
}

export default function NoData({
  message,
  onRefresh,
  className,
  size = 'large',
}: NoDataProps) {
  const t = useTranslations();
  return (
    <Card
      className={cn(
        'w-full bg-transparent text-dark-grey/15 border-dark-grey/5',
        size === 'small' && 'py-2',
        className
      )}
    >
      <CardContent
        className={cn(
          'flex flex-col items-center justify-center  h-full ',
          size === 'large' && 'min-h-[200px] px-6'
        )}
      >
        <AlertTriangle
          className={cn(
            '',
            size === 'small' && 'size-8 mb-2',
            size === 'large' && 'size-16 mb-4'
          )}
        />
        <p
          className={cn(
            'text-center   font-medium ',
            size === 'large' && 'text-lg mb-4'
          )}
        >
          {message ?? t('commonMessages.no_data_found')}
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
