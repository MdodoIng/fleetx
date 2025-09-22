'use client';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Loader2 } from 'lucide-react';
import React from 'react';

const LoadingPage: React.FC<{ hideHead?: boolean }> = ({ hideHead }) => {
  return (
    <Dashboard>
      <DashboardHeader hidden={hideHead}>
        <DashboardHeaderRight />
      </DashboardHeader>
      <DashboardContent className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardContent>
    </Dashboard>
  );
};

export default LoadingPage;
