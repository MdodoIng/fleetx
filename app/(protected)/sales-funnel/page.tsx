'use client';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { type JSX } from 'react';

function SalesFunnel(): JSX.Element {

  return <></>;
}

export default withAuth(SalesFunnel, [
  'SALES_HEAD',
  'OPERATION_MANAGER',
  'FINANCE_MANAGER',
]);
