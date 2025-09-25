'use client';
import { BalanceReportItem } from '@/features/wallet/type';
import TableComponent from '@/features/wallet/components/balance-report/TableComponent';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { Button } from '@/shared/components/ui/button';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { reportService } from '@/shared/services/report';
import { vendorService } from '@/shared/services/vendor';
import { TypeBranch } from '@/shared/types/vendor';
import { useSharedStore, useVendorStore } from '@/store';
import {
  BetweenVerticalEndIcon,
  Download,
  GitBranch,
  PlusSquare,
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

function BalanceReport(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
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
        vendorStore.selectedVendor?.id!,
        vendorStore.selectedBranch?.id!,
        nextSetItemTotal
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
    setIsLoading(true);

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
  }, [
    vendorStore.selectedVendor?.id,
    vendorStore.selectedBranch?.id,
    page,
    isCentralWallet,
  ]);

  console.log(data, 'aeefeafsafaaf');

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

  return (
    <Dashboard className="">
      <DashboardHeader>
        <DashboardHeaderRight />
        <div className="flex gap-1.5">
          <div className="flex items-center justify-center gap-1.5">
            <Button
              onClick={() => setIsCentralWallet(!isCentralWallet)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Wallet className="w-5 h-5" />{' '}
              {isCentralWallet ? 'Central Wallet' : 'Branch Wallet'}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Button
              onClick={() => exportOrdersToCSV(data!, 'balance-report', ``)}
              className="p-2 hover:bg-gray-100 rounded-lg"
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
            </TableLists>
          </Table>
        ) : (
          ''
        )}
      </DashboardContent>
    </Dashboard>
  );
}

export default BalanceReport;
