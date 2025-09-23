'use client';

import FilterHeader from '@/features/insights/components/user_referrals/FilterHeader';
import NoData from '@/features/insights/components/user_referrals/NoData';
import ReferralTable from '@/features/insights/components/user_referrals/ReferralTable';
import useUserReferrals from '@/features/insights/hooks/useUserReferrals';
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
  TableSigleList,
  TableSigleListContent,
  TableSigleListContentDetailsTitle,
  TableSigleListContents,
  TableSigleListContentTitle,
} from '@/shared/components/ui/tableList';
import { useAuthStore } from '@/store';
import { format } from 'date-fns';
import { Download, Loader2, Table } from 'lucide-react';
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

  return (
    <Dashboard className="h-auto sm:h-full">
      <DashboardHeader>
        <DashboardHeaderRight />

        <div className="flex items-center justify-between  gap-2">
          <DateSelect value={date} onChangeAction={setDate} />

          <SearchableSelect
            onChangeAction={setSelectedUser}
            options={searchOption}
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
                  <TableSigleList key={idx}>
                    <TableSigleListContents>
                      <TableSigleListContent>
                        <TableSigleListContentTitle>
                          Referral
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle>
                          {item.refBonusTo}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                      <TableSigleListContent>
                        <TableSigleListContentTitle>
                          Order Date
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle>
                          {format(
                            new Date(item.orderDate),
                            'dd MMM yyyy hh:mm a'
                          )}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                      <TableSigleListContent>
                        <TableSigleListContentTitle>
                          Order
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle>
                          {item.orderNumber}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                      <TableSigleListContent>
                        <TableSigleListContentTitle>
                          Vendor
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle>
                          {item.vendorName}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                      <TableSigleListContent>
                        <TableSigleListContentTitle>
                          Branch
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle>
                          {item.branchName}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                      <TableSigleListContent>
                        <TableSigleListContentTitle>
                          Delivery Fee
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle>
                          {item.fee?.toFixed(2)}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                    </TableSigleListContents>
                  </TableSigleList>
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
