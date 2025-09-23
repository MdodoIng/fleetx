'use client';

import React, { useState, useEffect } from 'react';
import TableComponent from '@/features/vendor/components/list/TableComponent';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { cn } from '@/shared/lib/utils';
import { reportService } from '@/shared/services/report';
import { useAuthStore } from '@/store';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Download, X } from 'lucide-react';
import { vendorService } from '@/shared/services/vendor';
import DateSelect from '@/shared/components/selectors/DateSelect';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { DateRange } from 'react-day-picker';
import SearchableSelect from '@/shared/components/selectors';
import { Table } from '@/shared/components/ui/table';
import {
  TableLists,
  TableSigleList,
  TableSigleListContent,
  TableSigleListContentDetailsTitle,
  TableSigleListContents,
  TableSigleListContentTitle,
} from '@/shared/components/ui/tableList';

interface AffiliateReferralData {
  orderNumber: string;
  orderDate: string;
  fee: number;
  affiliator: string;
  vendorName: string;
  branchName: string;
}

interface Affiliator {
  id: string;
  name: string;
}

const AffiliateReferrals = () => {
  const { user } = useAuthStore();

  const [date, setDate] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const [selectedAffiliator, setSelectedAffiliator] = useState<string>();
  const [affiliators, setAffiliators] = useState<Affiliator[]>([]);
  const [vendorBranch, setVendorBranch] = useState<any[]>([]);
  const [referralList, setReferralList] = useState<AffiliateReferralData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(10);

  const { exportOrdersToCSV } = useTableExport();

  const transformReferralData = (result: any[]) => {
    const mapped = result.map((element) => {
      const affiliatorName =
        affiliators.find((x) => x.id === element.ref_bonus_to)?.name || '';

      const vendorData = vendorBranch.find(
        (x: any) => x.vendor?.id === element.vendor_id
      );

      const branchData = vendorBranch.find(
        (x: any) => x.id === element.branch_id
      );

      return {
        orderNumber: element.order_number,
        orderDate: element.created_at,
        fee: element.delivery_fee,
        affiliator: affiliatorName,
        vendorName: vendorData?.vendor?.name || '',
        branchName: branchData?.name || '',
      };
    });

    setReferralList(mapped);
  };

  const fetchReferralDetails = async () => {
    if (!date.from || !date.to) {
      console.warn('Please select both start and end dates.');
      return;
    }

    if (date.from > date.to) {
      console.warn('To date should be greater than from date');
      return;
    }

    setIsLoading(true);
    try {
      const url = reportService.getReferralsURLs(
        1,
        page,
        selectedAffiliator!,
        date.from,
        date.to,
        1
      );

      const res = await reportService.getReferrals(url);
      transformReferralData(res.data);
      setTotalCount(res.count || 0);
    } catch (err: any) {
      console.error('Error fetching referral details:', err.message);
      console.error('Logged error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralDetails();
  }, [date, selectedAffiliator]);

  return (
    <Dashboard className="h-auto sm:h-full">
      <DashboardHeader>
        <DashboardHeaderRight />

        <div className="flex items-center justify-between  gap-2">
          <SearchableSelect
            onChangeAction={setSelectedAffiliator}
            options={affiliators}
            placeholder="Selct a Affiliate"
          />

          <DateSelect value={date} onChangeAction={setDate} />
          <Button
          // onClick={() =>
          //   exportOrdersToCSV(
          //     referralList,
          //     'Affiliate Referrals',
          //     `Affiliate Referrals ${date?.from ? format(date.from, 'yyyy-MM-dd') : ''} - ${
          //       date?.to ? format(date.to, 'yyyy-MM-dd') : ''
          //     }`
          //   )
          // }
          >
            <Download className="w-5 h-5" /> Export
          </Button>
        </div>
      </DashboardHeader>

      <DashboardContent className="flex-col w-full">
        <div className="flex flex-col items-center bg-gray-50 p-4">
          {referralList.length ? (
            <Table>
              <TableLists>
                {referralList.map((item, idx) => (
                  <TableSigleList key={idx}>
                    <TableSigleListContents>
                      <TableSigleListContent>
                        <TableSigleListContentTitle>
                          Order ID
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle>
                          {item.orderNumber}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                      <TableSigleListContent>
                        <TableSigleListContentTitle>
                          Order Date
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle>
                          {item.orderDate}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                      <TableSigleListContent>
                        <TableSigleListContentTitle>
                          Fee
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle>
                          {item.fee}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                      <TableSigleListContent>
                        <TableSigleListContentTitle>
                          Affiliator
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle>
                          {item.affiliator}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                      <TableSigleListContent>
                        <TableSigleListContentTitle>
                          Vendor Name
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle>
                          {item.vendorName}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                      <TableSigleListContent>
                        <TableSigleListContentTitle>
                          Branch Name
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle>
                          {item.branchName}
                        </TableSigleListContentDetailsTitle>
                      </TableSigleListContent>
                    </TableSigleListContents>
                  </TableSigleList>
                ))}
              </TableLists>
            </Table>
          ) : (
            ''
          )}
        </div>
      </DashboardContent>
    </Dashboard>
  );
};

export default AffiliateReferrals;
