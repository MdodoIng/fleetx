'use client';

import SearchableSelect from '@/shared/components/selectors';
import DateSelect from '@/shared/components/selectors/DateSelect';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { reportService } from '@/shared/services/report';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

import Export from '@/shared/components/Export';
import { TableFallback } from '@/shared/components/fetch/fallback';
import LoadMore from '@/shared/components/fetch/LoadMore';
import NoData from '@/shared/components/fetch/NoData';
import {
  Table,
  TableLists,
  TableSingleListContentDetailsTitle,
  TableSingleListContents,
  TableSingleListHeader,
} from '@/shared/components/ui/tableList';
import { vendorService } from '@/shared/services/vendor';

interface AffiliateReferralData {
  orderNumber: string;
  orderDate: string;
  fee: number;
  affiliate: string;
  vendorName: string;
  branchName: string;
}

interface Affiliate {
  id: string;
  name: string;
}

const AffiliateReferrals = () => {
  const [date, setDate] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const [selectedAffiliate, setSelectedAffiliate] = useState<string>();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [referralList, setReferralList] = useState<AffiliateReferralData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<number>(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>(null);

  const transformReferralData = async (result: any[]) => {
    const mapped = result.map(async (element) => {
      const affiliateName =
        affiliates.find((x) => x.id === element.ref_bonus_to)?.name || '';

      const vendorBranch = await vendorService.getBranchDetails(
        element.vendor_id
      );

      const branchData = vendorBranch.data.find(
        (x) => x.id === element.branch_id
      );

      return {
        orderNumber: element.order_number,
        orderDate: element.created_at,
        fee: element.delivery_fee,
        affiliate: affiliateName,
        vendorName: vendorBranch?.data[0].vendor.name || '',
        branchName: branchData?.name || '',
      };
    });

    const resolvedMapped = await Promise.all(mapped);
    setReferralList(resolvedMapped);
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

    try {
      const url = reportService.getReferralsURLs(
        1,
        page,
        selectedAffiliate!,
        date.from,
        date.to,
        1
      );

      const res = await reportService.getReferrals(url);
      transformReferralData(res.data);
      setNextSetItemTotal(res.count < page ? null : true);
    } catch (err: any) {
      console.error('Error fetching referral details:', err.message);
      console.error('Logged error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, selectedAffiliate, date.from, date.to]);

  useEffect(() => {
    vendorService.getAffiliation().then((res) => {
      setAffiliates(res.data);
    });
  }, []);

  if (isLoading) return <TableFallback />;

  return (
    <Dashboard className="h-auto sm:h-full">
      <DashboardHeader>
        <DashboardHeaderRight />

        <div className="flex items-center justify-between  gap-2">
          <SearchableSelect
            onChangeAction={setSelectedAffiliate}
            options={affiliates}
            placeholder="Select a Affiliate"
          />

          <DateSelect value={date} onChangeAction={setDate} />

          <Export data={referralList} title="Affiliate Referrals" />
        </div>
      </DashboardHeader>

      <DashboardContent className="flex-col w-full">
        {referralList.length ? (
          <Table>
            <TableLists>
              {referralList.map((item, idx) => (
                <TableSingleListHeader key={idx}>
                  <TableSingleListContents>
                    <TableSingleListContents>
                      <TableSingleListContentDetailsTitle>
                        Order ID
                      </TableSingleListContentDetailsTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.orderNumber}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContents>
                    <TableSingleListContents>
                      <TableSingleListContentDetailsTitle>
                        Order Date
                      </TableSingleListContentDetailsTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.orderDate}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContents>
                    <TableSingleListContents>
                      <TableSingleListContentDetailsTitle>
                        Fee
                      </TableSingleListContentDetailsTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.fee}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContents>
                    <TableSingleListContents>
                      <TableSingleListContentDetailsTitle>
                        Affiliate
                      </TableSingleListContentDetailsTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.affiliate}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContents>
                    <TableSingleListContents>
                      <TableSingleListContentDetailsTitle>
                        Vendor Name
                      </TableSingleListContentDetailsTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.vendorName}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContents>
                    <TableSingleListContents>
                      <TableSingleListContentDetailsTitle>
                        Branch Name
                      </TableSingleListContentDetailsTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.branchName}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContents>
                  </TableSingleListContents>
                </TableSingleListHeader>
              ))}
              <LoadMore
                setPage={setPage}
                nextSetItemTotal={nextSetItemTotal}
                type="table"
              />
            </TableLists>
          </Table>
        ) : (
          <NoData />
        )}
      </DashboardContent>
    </Dashboard>
  );
};

export default AffiliateReferrals;
