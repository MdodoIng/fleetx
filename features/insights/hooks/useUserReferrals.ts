"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';

export default function useUserReferrals() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const searchParams = useSearchParams();
  const branchId = searchParams.get('branchId') || '';
  const fromDate = searchParams.get('fromDate') || '';
  const toDate = searchParams.get('toDate') || '';

  useEffect(() => {
    fetchReferrals();
  }, [branchId, fromDate, toDate, page]);

  async function fetchReferrals() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/referrals?branchId=${branchId}&fromDate=${fromDate}&toDate=${toDate}&page=${page}`
      );
      const { data, total } = await res.json();
      setReferrals(data);
      setTotalCount(total);
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
    } finally {
      setLoading(false);
    }
  }

  async function exportReferrals() {
    setExporting(true);
    try {
      const res = await fetch(
        `/api/referrals/export?branchId=${branchId}&fromDate=${fromDate}&toDate=${toDate}`
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `referrals_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  }

  return {
    referrals,
    loading,
    totalCount,
    page,
    setPage,
    exportReferrals,
    exporting,
  };
}
