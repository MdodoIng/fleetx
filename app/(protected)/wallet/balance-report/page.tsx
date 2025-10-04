'use client';
import { BalanceReportItem } from '@/features/wallet/type';
import { Button } from '@/shared/components/ui/button';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { reportService } from '@/shared/services/report';
import { useSharedStore, useVendorStore } from '@/store';
import {
  BetweenVerticalEndIcon,
  Download,
  GitBranch,
  ServerCrash,
  User2,
  Wallet,
} from 'lucide-react';
import { useEffect, useState, type JSX } from 'react';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import {
  Table,
  TableLists,
  TableSingleList,
  TableSingleListContent,
  TableSingleListContentDetailsTitle,
  TableSingleListContents,
  TableSingleListContentTitle,
} from '@/shared/components/ui/tableList';
import { TableFallback } from '@/shared/components/fetch/fallback';
import LoadMore from '@/shared/components/fetch/LoadMore';
import NoData from '@/shared/components/fetch/NoData';

function BalanceReport(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>(null);
  const vendorStore = useVendorStore();
  const [data, setData] = useState<BalanceReportItem[]>();
  const [isCentralWallet, setIsCentralWallet] = useState(false);
  const { appConstants } = useSharedStore();

  const fetchCentralWalletBalance = async (): Promise<
    BalanceReportItem[] | undefined
  > => {
    if (!vendorStore.selectedVendor?.id) {
      console.warn('No vendor ID available for central wallet');
      return [];
    }

    try {
      const url = reportService.getVendorBalanceUrl(
        page,
        vendorStore.selectedVendor?.id,
        nextSetItemTotal
      );
      const res = await reportService.getVendorBalanceReport(url);
      // @ts-ignore
      return res.data || undefined;
    } catch (error) {
      console.error('Failed to fetch central wallet balance:', error);
      throw error; // Re-throw to be handled by main function
    }
  };

  const fetchBranchWalletBalances = async (): Promise<
    BalanceReportItem[] | undefined
  > => {
    try {
      const url = reportService.getBranchWalletBalanceUrl(
        page,
        vendorStore.selectedVendor?.id ?? '',
        vendorStore.selectedBranch?.id ?? '',
        null
      );
      const res = await reportService.getBranchWalletBalanceReport(url);

      if (!res.data) {
        return [];
      }

      return await Promise.all(
        res.data.map(async (r) => {
          const vendor = vendorStore.vendorList?.find(
            (item) =>
              r.vendor.name.toLocaleLowerCase() ===
              item.name.toLocaleLowerCase()
          );
          // console.clear();
          console.log(vendor);

          return {
            vendor: r?.vendor.name,
            branch:
              vendorStore.selectedBranch?.name! ||
              vendor?.main_branch.name ||
              'N/A',
            walletBalance: Number(r?.wallet_balance) || 0,
            minWalletBalance: Number(r?.required_min_wallet_balance) || 0,
          };
        })
      );
    } catch (error) {
      console.error(
        `Failed to fetch balance for branch ${vendorStore.selectedBranch?.name}:`,
        error
      );
      return []; // Return empty array to continue processing other branches
    }
  };

  // Updated main function
  const fetchBalanceReport = async (): Promise<void> => {
    try {
      let data: BalanceReportItem[];

      if (isCentralWallet) {
        const fetchedData = await fetchCentralWalletBalance();
        data = fetchedData || [];
      } else {
        const fetchedData = await fetchBranchWalletBalances();
        data = fetchedData || [];
      }

      setData(data!);
      setNextSetItemTotal(data.length < page ? null : true);
      console.log(`Successfully fetched ${data.length} balance records`);
    } catch (err: any) {
      const errorMessage =
        err?.error?.message ||
        err?.message ||
        'An unknown error occurred while fetching wallet balance.';

      console.error('Error in fetchBalanceReport:', errorMessage);

      // Optionally show error to user
      // setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadFetchBalanceReport = async () => {
      await fetchBalanceReport();
    };
    loadFetchBalanceReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    vendorStore.selectedVendor?.id,
    vendorStore.selectedBranch?.id,
    page,
    isCentralWallet,
  ]);

  const tableData = data?.map((item) => {
    return [
      {
        icon: User2,
        title: 'Vendor',
        value: item.vendor,
      },
      {
        icon: GitBranch,
        title: 'Branch',
        value: item.branch,
      },
      {
        icon: ServerCrash,
        title: 'Min Wallet Balance',
        value: `${item.minWalletBalance} ${appConstants?.currency}`,
      },
      {
        icon: BetweenVerticalEndIcon,
        title: 'Balance',

        value: `${item.walletBalance >= 0 ? '+' : '-'}${Math.abs(item.walletBalance)} ${appConstants?.currency}`,
      },
    ];
  });

  const { exportOrdersToCSV } = useTableExport();

  if (isLoading) return <TableFallback />;

  return (
    <Dashboard className="">
      <DashboardHeader>
        <DashboardHeaderRight />
        <div className="flex gap-1.5">
          <div className="flex items-center justify-center gap-1.5">
            <Button onClick={() => setIsCentralWallet(!isCentralWallet)}>
              <Wallet className="w-5 h-5" />{' '}
              {isCentralWallet ? 'Central Wallet' : 'Branch Wallet'}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Button
              onClick={() => exportOrdersToCSV(data!, 'balance-report', ``)}
            >
              <Download className="w-5 h-5" /> Export
            </Button>
          </div>
        </div>
      </DashboardHeader>
      <DashboardContent className="relative z-0 flex-col">
        {tableData?.length ? (
          <Table>
            <TableLists>
              {tableData.map((item, idx) => (
                <TableSingleList key={idx}>
                  <TableSingleListContents>
                    {item.map((i, listIdx) => (
                      <TableSingleListContent key={listIdx}>
                        <TableSingleListContentTitle>
                          <i.icon size={14} />
                          {i.title}
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle className="line-clamp-2">
                          {i.value}
                        </TableSingleListContentDetailsTitle>
                      </TableSingleListContent>
                    ))}
                  </TableSingleListContents>
                </TableSingleList>
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
}

export default BalanceReport;
