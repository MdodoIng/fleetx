'use client';

import FunnelChart from '@/features/insights/components/overview/FunnelChart';
import InsightTiles from '@/features/insights/components/overview/InsightTiles';
import useInsightBoard from '@/features/insights/hooks/useInsightBoard';
import Export from '@/shared/components/Export';
import { OverviewFallback } from '@/shared/components/fetch/fallback';
import DateSelect from '@/shared/components/selectors/DateSelect';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';

function Overview() {
  const { date, setDate, metrics, isLoading } = useInsightBoard();

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

          <Export
            data={[...statisticsInsightTiles, ...statisticsFunnelChart]}
            title="summary of your key metrics"
          />
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
