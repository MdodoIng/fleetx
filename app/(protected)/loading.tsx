'use client';
import { TableFallback } from '@/shared/components/fetch/fallback';
import React from 'react';

const LoadingPage: React.FC<{ hideHead?: boolean }> = ({ hideHead }) => {
  return <TableFallback />;
};

export default LoadingPage;
