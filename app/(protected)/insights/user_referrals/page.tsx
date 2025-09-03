'use client';

import FilterHeader from '@/features/insights/components/user_referrals/FilterHeader';
import NoData from '@/features/insights/components/user_referrals/NoData';
import ReferralTable from '@/features/insights/components/user_referrals/ReferralTable';
import useUserReferrals from '@/features/insights/hooks/useUserReferrals';
import { Loader2 } from 'lucide-react';

export default function ReferralDashboard() {
  const {
    referrals,
    loading,
    totalCount,
    page,
    setPage,
    exportReferrals,
    exporting,
  } = useUserReferrals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <FilterHeader
        users={[]} // Assuming users will be fetched or passed down
        selectedUser={null} // Initialize as null or appropriate default
        onUserChange={() => {}} // Placeholder function
        fromDate={null} // Initialize as null or appropriate default
        toDate={null} // Initialize as null or appropriate default
        onFromDateChange={() => {}} // Placeholder function
        onToDateChange={() => {}} // Placeholder function
        onApplyFilter={() => {}} // Placeholder function
        onExport={exportReferrals} // Pass the export function from useReferrals
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
