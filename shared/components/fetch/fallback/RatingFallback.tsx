'use client';

import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';

export default function RatingFallback() {
  return (
    <Dashboard transition={{ duration: 0.5 }} className="h-auto sm:h-full">
      <DashboardHeader>
        <DashboardHeaderRight />
      </DashboardHeader>

      <DashboardContent className="space-y-6 flex-col">
        {/* Top Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Improvement Table Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-16 w-full rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </Skeleton>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FleetX Rating Skeleton */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-primary-blue to-purple-600 text-white relative overflow-hidden h-full">
              <CardContent className="flex flex-col items-center justify-center text-center h-full space-y-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-12 w-48 rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Rating Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader className="border-b-0 pb-2">
                <Skeleton className="h-10 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between"
                    >
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-9 w-32 rounded-lg" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardContent>
    </Dashboard>
  );
}
