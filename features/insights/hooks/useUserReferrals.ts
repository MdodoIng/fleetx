'use client';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { reportService } from '@/shared/services/report';
import { vendorService } from '@/shared/services/vender';
import { TypeOpsFinUser } from '@/shared/types/vender';
import { DateRange } from 'react-day-picker';

export default function useUserReferrals() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  const searchParams = useSearchParams();
  const branchId = searchParams.get('branchId') ?? '';
  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const [trigger, setTrigger] = useState(false);
  const [nextSetItemsToken, setNextSetItemsToken] = useState<any>();
  const [users, setUsers] = useState<TypeOpsFinUser[]>([]);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    try {
      const url = reportService.getReferralsURLs(
        1,
        page,
        selectedUser,
        date?.from,
        date?.to,
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
  }, [date?.from, date?.to, page, selectedUser]);

  const fetchOpsFinUser = useCallback(async () => {
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
  }, []);

  return {
    referrals,
    loading,
    totalCount,
    page,
    setPage,
    exporting,
    selectedUser,
    setSelectedUser,
    setTrigger,
    users,
    setUsers,
    fetchReferrals,
    fetchOpsFinUser,
    setDate,
    date,
  };
}
