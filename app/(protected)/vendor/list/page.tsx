'use client';
import { BalanceReportItem } from '@/features/wallet/type';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { Button } from '@/shared/components/ui/button';
import { Popover } from '@/shared/components/ui/popover';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { reportService } from '@/shared/services/report';
import { vendorService } from '@/shared/services/vender';
import { TypeWalletTransactionHistoryRes } from '@/shared/types/report';
import {
  RootTypeBranch,
  TypeBranch,
  TypeVenderList,
} from '@/shared/types/vender';
import { useOrderStore, useVenderStore } from '@/store';
import { useAuthStore } from '@/store/useAuthStore';
import { Download, Search, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type JSX } from 'react';
import { Input } from '@/shared/components/ui/input';
import TableComponent from '@/features/vendor/components/list/TableComponent';

function VenderList(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>(null);
  const venderStore = useVenderStore();
  const [isCentralWallet, setIsCentralWallet] = useState(false);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [data, setData] = useState<TypeVenderList | undefined>(undefined);

  // Updated main function
  const fetchVenderList = async (): Promise<void> => {
    setIsLoading(true);

    try {
      venderStore.getVendorAccoutManagerId();
      const url = vendorService.setVendorListurl(page, searchValue, null);

      try {
        const res = await vendorService.getVendorList(url);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    } catch (err: any) {
      const errorMessage =
        err?.error?.message ||
        err?.message ||
        'An unknown error occurred while fetching wallet balance.';

      console.error('Error in fetchBalanceReport:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadFetchVenderList = async () => {
      await fetchVenderList();
    };
    loadFetchVenderList();
  }, [page]);

  console.log(data, 'aeefeafsafaaf');

  const { exportOrdersToCSV } = useTableExport();

  return (
    <div className="flex bg-gray-50 flex-col items-center overflow-hidden">
      {/* Left Panel - Orders List */}

      <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
        <div className="flex items-center justify-between gap-10 ">
          <h2 className="text-xl font-semibold text-gray-900">Vendor List</h2>
          <div className="flex items-center justify-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <Input
                type="text"
                
                placeholder="Search..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button
                onClick={async () => await fetchVenderList()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Search className="w-5 h-5" /> Search
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-center gap-1.5">
          <Button
            // onClick={() => exportOrdersToCSV(data!, 'balance-report', ``)}
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

export default withAuth(VenderList, [
  'OPERATION_MANAGER',
  'VENDOR_ACCOUNT_MANAGER',
  'SALES_HEAD',
]);
