'use client';
import { BalanceReportItem } from '@/features/wallet/type';
import TableComponent from '@/features/wallet/components/balance-report/TableComponent';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { Button } from '@/shared/components/ui/button';
import { Popover } from '@/shared/components/ui/popover';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { reportService } from '@/shared/services/report';
import { vendorService } from '@/shared/services/vender';
import { TypeWalletTransactionHistoryRes } from '@/shared/types/report';
import { RootTypeBranch, TypeBranch } from '@/shared/types/vender';
import { useOrderStore, useVenderStore } from '@/store';
import { useAuthStore } from '@/store/useAuthStore';
import { Download, Search, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type JSX } from 'react';
import { is } from 'zod/v4/locales';

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
    if (!venderStore.vendorId) {
      console.warn('No vendor ID available for central wallet');
      return [];
    }

    try {
      const url = reportService.getVendorBalanceUrl(
        page,
        venderStore.vendorId,
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
    const allVendors = venderStore.venderList || [];

    if (allVendors.length === 0) {
      console.warn('No vendors available');
      return [];
    }

    try {
      // Process vendors in parallel for better performance
      const vendorPromises = allVendors.map(async (vendor) => {
        try {
          const allBranches = await vendorService.getBranchDetails(vendor.id);
          const branches = allBranches?.data || [];

          console.log(branches, 'branches');

          if (branches.length === 0) {
            console.warn(`No branches found for vendor: ${vendor.name}`);
            return [];
          }

          // Process branches in parallel for each vendor
          const branchPromises = branches.map(async (branch: TypeBranch) => {
            try {
              const url = reportService.getBranchWalletBalanceUrl(
                page,
                vendor.id!,
                branch.id!,
                nextSetItemTotal
              );
              const res = await reportService.getBranchWalletBalanceReport(url);

              if (!res.data) {
                return [];
              }

              return res.data.map((r) => ({
                vendor: vendor.name,
                branch: branch.name,
                walletBalance: r?.balance?.balance_amount || 0,
                minWalletBalance: branch.required_min_wallet_balance || 0,
              }));
            } catch (error) {
              console.error(
                `Failed to fetch balance for branch ${branch.name}:`,
                error
              );
              return []; // Return empty array to continue processing other branches
            }
          });

          const branchResults = await Promise.all(branchPromises);
          return branchResults.flat();
        } catch (error) {
          console.error(
            `Failed to fetch branches for vendor ${vendor.name}:`,
            error
          );
          return []; // Continue processing other vendors
        }
      });

      const vendorResults = await Promise.all(vendorPromises);
      // @ts-ignore
      return vendorResults.flat() || undefined;
    } catch (error) {
      console.error('Failed to fetch branch wallet balances:', error);
      throw error;
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
  }, [venderStore.vendorId, venderStore.branchId, page, isCentralWallet]);

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
