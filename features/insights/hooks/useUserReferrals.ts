'use client';
import { reportService } from '@/shared/services/report';
import { vendorService } from '@/shared/services/vendor';
import { TypeOpsFinUser } from '@/shared/types/vendor';
import { useCallback, useState } from 'react';
import { DateRange } from 'react-day-picker';

export default function useUserReferrals() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState('');

  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  const [nextSetItemsToken, setNextSetItemsToken] = useState<any>();
  const [users, setUsers] = useState<TypeOpsFinUser[]>([]);

  const fetchReferrals = useCallback(async () => {
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
      setNextSetItemsToken(res.data.length < page ? null : true);
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
    } finally {
      setLoading(false);
    }
  }, [date?.from, date?.to, page, selectedUser]);

  const fetchOpsFinUser = useCallback(async () => {
    try {
      const res = await vendorService.getOpsFinUser();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch opsFinUser:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    referrals,
    loading,
    page,
    setPage,
    selectedUser,
    setSelectedUser,
    users,
    setUsers,
    fetchReferrals,
    fetchOpsFinUser,
    setDate,
    date,
    nextSetItemsToken,
  };
}
