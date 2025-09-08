'use client';
import { BalanceReportItem } from '@/features/wallet/type';
import TableComponent from '@/features/wallet/components/balance-report/TableComponent';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { Button } from '@/shared/components/ui/button';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { reportService } from '@/shared/services/report';
import { vendorService } from '@/shared/services/vender';
import { TypeBranch } from '@/shared/types/vender';
import { useVenderStore } from '@/store';
import { Download, Wallet } from 'lucide-react';
import { useEffect, useState, type JSX } from 'react';

function BalanceReport(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>(null);
  const venderStore = useVenderStore();
  const [data, setData] = useState<BalanceReportItem[]>();
  const [isCentralWallet, setIsCentralWallet] = useState(false);

  const fetchCentralWalletBalance = async (): Promise<
    BalanceReportItem[] | undefined
  > => {
    if (!venderStore.selectedVendor?.id) {
      console.warn('No vendor ID available for central wallet');
      return [];
    }

    try {
      const url = reportService.getVendorBalanceUrl(
        page,
        venderStore.selectedVendor?.id,
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
        venderStore.selectedVendor?.id!,
        venderStore.selectedBranch?.id!,
        nextSetItemTotal
      );
      const res = await reportService.getBranchWalletBalanceReport(url);

      if (!res.data) {
        return [];
      }

      return await Promise.all(
        res.data.map(async (r) => {
          const vendor = venderStore.venderList?.find(
            (item) =>
              r.vendor.name.toLocaleLowerCase() ===
              item.name.toLocaleLowerCase()
          );
          // console.clear();
          console.log(vendor);

          return {
            vendor: r?.vendor.name,
            branch:
              venderStore.selectedBranch?.name! ||
              vendor?.main_branch.name ||
              'N/A',
            walletBalance: Number(r?.wallet_balance) || 0,
            minWalletBalance: Number(r?.required_min_wallet_balance) || 0,
          };
        })
      );
    } catch (error) {
      console.error(
        `Failed to fetch balance for branch ${venderStore.selectedBranch?.name}:`,
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
    venderStore.selectedVendor?.id,
    venderStore.selectedBranch?.id,
    page,
    isCentralWallet,
  ]);

  console.log(data, 'aeefeafsafaaf');

  const { exportOrdersToCSV } = useTableExport();

  return (
    <div className="flex bg-gray-50 flex-col items-center overflow-hidden">
      {/* Left Panel - Orders List */}

      <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
        <div className="flex items-center justify-between gap-10 ">
          <h2 className="text-xl font-semibold text-gray-900">
            Balance Report
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            <Button
              onClick={() => setIsCentralWallet(!isCentralWallet)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Wallet className="w-5 h-5" />{' '}
              {isCentralWallet ? 'Central Wallet' : 'Branch Wallet'}
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-center gap-1.5">
          <Button
            onClick={() => exportOrdersToCSV(data!, 'balance-report', ``)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Download className="w-5 h-5" /> Export
          </Button>
        </div>
      </div>

      {data?.length ? (
        <TableComponent
          data={data!}
          page={page}
          setPage={setPage}
          nextSetItemTotal={nextSetItemTotal}
        />
      ) : (
        <>no data</>
      )}
    </div>
  );
}

export default withAuth(BalanceReport, [
  'OPERATION_MANAGER',
  'FINANCE_MANAGER',
  'VENDOR_ACCOUNT_MANAGER',
  'SALES_HEAD',
]);
