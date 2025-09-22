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
import { vendorService } from '@/shared/services/vender';
import DateSelect from '@/shared/components/selectors/DateSelect';

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

  const [date, setDate] = useState<{ from: Date; to: Date }>({
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
    <div className="flex flex-col items-center bg-gray-50 p-4">
      <div className="flex items-center justify-between w-full  bg-gray-200 px-4 py-3 rounded mb-4">
        <div className="flex items-center gap-2">
          <Select
            value={selectedAffiliator}
            onValueChange={(value) => setSelectedAffiliator(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Affiliator" />
            </SelectTrigger>
            <SelectContent>
              {affiliators.map((aff) => (
                <SelectItem key={aff.id} value={aff.id}>
                  {aff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAffiliator && (
            <span
              onClick={() => setSelectedAffiliator(undefined)}
              className="cursor-pointer"
            >
              <X />
            </span>
          )}
          <DateSelect value={date} onChangeAction={setDate}  />
        </div>
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
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Download className="w-5 h-5" /> Export
        </Button>
      </div>
      {referralList.length ? (
        <TableComponent data={referralList} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default AffiliateReferrals;
