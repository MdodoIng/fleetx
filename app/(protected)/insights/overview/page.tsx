'use client';

import { Button } from '@/shared/components/ui/button';
import { Download } from 'lucide-react';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import InsightTiles from '@/features/insights/components/overview/InsightTiles';
import FunnelChart from '@/features/insights/components/overview/FunnelChart';
import useInsightBoard from '@/features/insights/hooks/useInsightBoard';
import DateSelect from '@/shared/components/selectors/DateSelect';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { OverviewFallback } from '@/shared/components/fetch/fallback';

function Overview() {
  const { date, setDate, metrics, isLoading } = useInsightBoard();

  const { exportOrdersToCSV } = useTableExport();

  const statisticsInsightTiles = [
    { title: 'Sign ups', count: metrics.totalSignups },
    { title: 'Total Recharges', count: metrics.totalRecharges },
    {
      title: 'Total First Time Recharges',
      count: metrics.totalFirstTimeRecharges,
    },
    { title: 'Total Orders', count: metrics.totalOrders },
    {
      title: 'Total First Time Orders',
      count: metrics.totalFirstTimeOrders,
    },
    {
      title: 'Total Funnel Activated',
      count: metrics.totalFunnelActivated,
    },
    { title: 'Active Count', count: metrics.activeBranchCount },
    { title: 'Inactive Count', count: metrics.inactiveBranchCount },
    {
      title: 'Reactivated Count',
      count: metrics.reactivatedFunnelCount,
    },
    {
      title: 'UpToDate Active Count',
      count: metrics.upToDateActiveCount,
      highlight: true,
    },
  ];

  const statisticsFunnelChart = [
    { title: 'Signed up', count: metrics.totalSignups },
    {
      title: 'First Wallet Recharge',
      count: metrics.firstWalletRecharges,
      percentage: metrics.firstWalletRechargesPercentage,
    },
    {
      title: 'Activated',
      count: metrics.totalActivated,
      percentage: metrics.totalActivatedPercentage,
    },
  ];

  if (isLoading) return <OverviewFallback />;

  return (
    <Dashboard className="h-auto sm:h-full">
      <DashboardHeader>
        <DashboardHeaderRight />
        {/* Search and Filter */}
        <div className="flex sm:justify-center gap-1.5 max-sm:w-full justify-between">
          <DateSelect value={date} onChangeAction={setDate} />
          <Button className="p-2 hover:bg-gray-100 rounded-lg">
            <Download className="w-5 h-5" /> Export
          </Button>
        </div>
      </DashboardHeader>

      {/* Statistics Cards */}
      <DashboardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightTiles metrics={statisticsInsightTiles} />
        <FunnelChart data={statisticsFunnelChart} />
      </DashboardContent>
    </Dashboard>
  );
}

export default Overview;
