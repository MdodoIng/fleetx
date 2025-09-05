'use client';

import FilterHeader from '@/features/insights/components/user_referrals/FilterHeader';
import NoData from '@/features/insights/components/user_referrals/NoData';
import ReferralTable from '@/features/insights/components/user_referrals/ReferralTable';
import useUserReferrals from '@/features/insights/hooks/useUserReferrals';
import { useAuthStore } from '@/store';
import { Loader2 } from 'lucide-react';

export default function ReferralDashboard() {
  const {
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
  } = useUserReferrals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <FilterHeader
        users={users}
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onApplyFilter={setTrigger}
        onExport={() => {}}
      />

      {/* Table or No Data */}
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">
          <Loader2 className="animate-spin mx-auto mb-4 w-6 h-6" />
          <p className="text-sm">Loading referrals...</p>
        </div>
      ) : referrals.length > 0 ? (
        <>
          <ReferralTable data={referrals} />
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
}
