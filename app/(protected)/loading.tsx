'use client';
import { TableFallback } from '@/shared/components/fetch/fallback';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Loader2 } from 'lucide-react';
import React from 'react';

const LoadingPage: React.FC<{ hideHead?: boolean }> = ({ hideHead }) => {
  return <TableFallback />;
};

export default LoadingPage;
