'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { reportService } from '@/shared/services/report';
import { vendorService } from '@/shared/services/vender';
import { TypeOpsFinUser } from '@/shared/types/vender';

export default function useUserReferrals() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  const searchParams = useSearchParams();
  const branchId = searchParams.get('branchId') ?? '';
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [trigger, setTrigger] = useState(false);
  const [nextSetItemsToken, setNextSetItemsToken] = useState<any>();
  const [users, setUsers] = useState<TypeOpsFinUser[]>([]);

  useEffect(() => {
    fetchReferrals();
  }, [branchId, fromDate, toDate, page, trigger]);

  useEffect(() => {
    fetchOpsFinUser();
  }, []);

  async function fetchReferrals() {
    setLoading(true);
    try {
      const url = reportService.getReferralsURLs(
        1,
        page,
        selectedUser,
        fromDate,
        toDate,
        2
      );
      const res = await reportService.getReferrals(url);
      setReferrals(res.data);
      setNextSetItemsToken(res.NEXT_SET_ITEMS_TOKEN);
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
    } finally {
      setLoading(false);
      setTrigger(false);
    }
  }

  async function fetchOpsFinUser() {
    setLoading(true);
    try {
      const res = await vendorService.getOpsFinUser();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch opsFinUser:', err);
    } finally {
      setLoading(false);
      setTrigger(false);
    }
  }

  return {
    referrals,
    loading,
    totalCount,
    page,
    setPage,
    exporting,
    selectedUser,
    setSelectedUser,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    setTrigger,
    users,
    setUsers,
  };
}
