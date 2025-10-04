'use client';

import { Card, CardContent } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';

export default function SettingsFallback() {
  return (
    <Card className="h-full">
      <CardContent className="h-full space-y-4">
        {' '}
        {/* Section Title */}
        <Skeleton className="h-6 w-64" />
        {/* Toggle Switch Label */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        {/* Block Message Input */}
        <Skeleton className="h-10 w-full" />
        {/* Update Button */}
        <Skeleton className="h-10 w-full mt-10" />
      </CardContent>
    </Card>
  );
}
