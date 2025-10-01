'use client';

import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';

import OperationTimingCard from '@/features/config/components/settings/OperationTimingCard';
import WarningMessageCard from '@/features/config/components/settings/WarningMessageCard';
import AreaRestrictionCard from '@/features/config/components/settings/AreaRestrictionCard';
import GeneralConfigCard from '@/features/config/components/settings/GeneralConfigCard';

export default function SystemConfigPage() {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderRight />
      </DashboardHeader>

      <DashboardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <OperationTimingCard />
        <WarningMessageCard />
        <AreaRestrictionCard />
        <GeneralConfigCard />
      </DashboardContent>
    </Dashboard>
  );
}
