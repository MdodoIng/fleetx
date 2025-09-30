'use client';

import FilterHeader from '@/features/insights/components/user_referrals/FilterHeader';
import NoData from '@/features/insights/components/user_referrals/NoData';
import ReferralTable from '@/features/insights/components/user_referrals/ReferralTable';
import useUserReferrals from '@/features/insights/hooks/useUserReferrals';
import { TableFallback } from '@/shared/components/fetch/fallback';
import SearchableSelect, {
  TypeSearchableSelectOption,
} from '@/shared/components/selectors';
import DateSelect from '@/shared/components/selectors/DateSelect';
import { Button } from '@/shared/components/ui/button';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import {
  TableLists,
  Table,
  TableSingleListHeader,
  TableSingleListContents,
  TableSingleListContentDetailsTitle,
  TableSingleListContent,
} from '@/shared/components/ui/tableList';
import { useAuthStore } from '@/store';
import { format } from 'date-fns';
import { Download, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function ReferralDashboard() {
  const {
    referrals,
    loading,

    selectedUser,
    setSelectedUser,
    setTrigger,
    users,
    fetchOpsFinUser,
    fetchReferrals,
    date,
    setDate,
  } = useUserReferrals();

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  useEffect(() => {
    fetchOpsFinUser();
  }, [fetchOpsFinUser]);

  const searchOption: TypeSearchableSelectOption[] = users.map((item) => {
    return {
      id: item.id,
      name: item.first_name,
    };
  });
  
    if (loading) return <TableFallback />;

  return (
    <Dashboard className="h-auto sm:h-full">
      <DashboardHeader>
        <DashboardHeaderRight />

        <div className="flex items-center justify-between  gap-2">
          <DateSelect value={date} onChangeAction={setDate} />

          <SearchableSelect
            onChangeAction={setSelectedUser}
            options={searchOption}
            value={selectedUser}
            placeholder="Search User"
          />

          <Button
            // onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </DashboardHeader>

      <DashboardContent className="flex-col w-full items-center">
        {referrals.length > 0 ? (
          <>
            <Table>
              <TableLists>
                {referrals.map((item, idx) => (
                  <TableSingleListHeader key={idx}>
                    <TableSingleListContents>
                      <TableSingleListContents>
                        <TableSingleListContentDetailsTitle>
                          Referral
                        </TableSingleListContentDetailsTitle>
                        <TableSingleListContentDetailsTitle>
                          {item.refBonusTo}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContents>
                      <TableSingleListContents>
                        <TableSingleListContentDetailsTitle>
                          Order Date
                        </TableSingleListContentDetailsTitle>
                        <TableSingleListContentDetailsTitle>
                          {format(
                            new Date(item.orderDate),
                            'dd MMM yyyy hh:mm a'
                          )}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContents>
                      <TableSingleListContents>
                        <TableSingleListContentDetailsTitle>
                          Order
                        </TableSingleListContentDetailsTitle>
                        <TableSingleListContentDetailsTitle>
                          {item.orderNumber}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContents>
                      <TableSingleListContents>
                        <TableSingleListContentDetailsTitle>
                          Vendor
                        </TableSingleListContentDetailsTitle>
                        <TableSingleListContentDetailsTitle>
                          {item.vendorName}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContents>
                      <TableSingleListContents>
                        <TableSingleListContentDetailsTitle>
                          Branch
                        </TableSingleListContentDetailsTitle>
                        <TableSingleListContentDetailsTitle>
                          {item.branchName}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContents>
                      <TableSingleListContents>
                        <TableSingleListContentDetailsTitle>
                          Delivery Fee
                        </TableSingleListContentDetailsTitle>
                        <TableSingleListContentDetailsTitle>
                          {item.fee?.toFixed(2)}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContents>
                    </TableSingleListContents>
                  </TableSingleListHeader>
                ))}
              </TableLists>
            </Table>
          </>
        ) : (
          ''
        )}
      </DashboardContent>
    </Dashboard>
  );
}
