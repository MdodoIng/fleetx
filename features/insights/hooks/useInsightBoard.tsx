import { reportService } from '@/shared/services/report';
import { useCallback, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

export default function useInsightBoard() {
  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),

    to: new Date(),
  });
  const [isLoading, setIsloading] = useState(true);

  const [metrics, setMetrics] = useState({
    totalSignups: 0,
    totalRecharges: 0,
    totalFirstTimeRecharges: 0,
    totalOrders: 0,
    firstWalletRecharges: 0,
    totalActivated: 0,
    totalFirstTimeOrders: 0,
    totalFunnelActivated: 0,
    activeBranchCount: 0,
    inactiveBranchCount: 0,
    upToDateActiveCount: 0,
    reactivatedFunnelCount: 0,
    firstWalletRechargesPercentage: '0%',
    totalActivatedPercentage: '0%',
  });

  const fetchInsights = useCallback(async () => {
    try {
      const res = await reportService.getDashboardInsight(date.from!, date.to!);

      const data = res.data;

      const firstWalletRechargesPercentage =
        data.first_wallet_recharges && data.total_signups
          ? ((data.first_wallet_recharges / data.total_signups) * 100).toFixed(
              2
            ) + '%'
          : '0%';

      const totalActivatedPercentage =
        data.total_activated && data.first_wallet_recharges
          ? (
              (data.total_activated / data.first_wallet_recharges) *
              100
            ).toFixed(2) + '%'
          : '0%';

      setMetrics({
        totalSignups: data.total_signups || 0,
        totalRecharges: data.total_recharges || 0,
        totalFirstTimeRecharges: data.total_first_time_recharges || 0,
        totalOrders: data.total_orders || 0,
        firstWalletRecharges: data.first_wallet_recharges || 0,
        totalActivated: data.total_activated || 0,
        totalFirstTimeOrders: data.total_first_time_orders || 0,
        totalFunnelActivated: data.total_funnel_activated || 0,
        activeBranchCount: data.active_branch_count || 0,
        inactiveBranchCount: data.inactive_branch_count || 0,
        upToDateActiveCount: data.up_to_date_active_count || 0,
        reactivatedFunnelCount: data.reactivated_funnel_count || 0,
        firstWalletRechargesPercentage,
        totalActivatedPercentage,
      });
    } catch (err: unknown) {
      toast.error(
        (err as { response: { data: { message: string } } }).response?.data
          ?.message || 'Server error'
      );
      console.error(err);
    } finally {
      setIsloading(false);
    }
  }, [date.from, date.to, setMetrics]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    date,
    setDate,
    metrics,
    isLoading
  };
}
