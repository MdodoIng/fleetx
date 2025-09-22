'use client';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { vendorService } from '@/shared/services/vender';
import { TypeVenderList } from '@/shared/types/vender';
import { useVenderStore } from '@/store';
import { useCallback, useEffect, useState, type JSX } from 'react';
import VendersList from '@/features/vendor/components/list/VendersList';
import EditVender from '@/features/vendor/components/list/EditVender';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Input } from '@/shared/components/ui/input';
import { Download, Search, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

function VenderList(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>(null);
  const { isEditVenderId, getVendorAccountManagerId, setValue } =
    useVenderStore();

  const [searchValue, setSearchValue] = useState<string | null>('');
  const [data, setData] = useState<TypeVenderList | undefined>(undefined);

  // Updated main function

  const fetchVenderList = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      getVendorAccountManagerId();
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
  }, [getVendorAccountManagerId, page, searchValue]);

  useEffect(() => {
    const loadFetchVenderList = async () => {
      await fetchVenderList();
    };
    loadFetchVenderList();
  }, [fetchVenderList]);

  console.log(data, 'aeefeafsafaaf');

  const { exportOrdersToCSV } = useTableExport();

  console.log();

  return (
    <Dashboard className="">
      <DashboardHeader>
        <DashboardHeaderRight
          title={isEditVenderId && 'Edit Vendor Details'}
          subtitle={isEditVenderId && 'Manage Vendor Information'}
        />

        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between max-sm:flex-wrap">
          <div hidden={!!isEditVenderId} className="relative max-sm:w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={'Search Vender'}
              value={searchValue!}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0 "
            />
          </div>
          <Button
            // onClick={() => exportOrdersToCSV(data!, 'balance-report', ``)}
            //   onClick={() => venderStore.setValue('isEditVenderId', undefined)}
            onClick={() =>
              isEditVenderId ? setValue('isEditVenderId', undefined) : ''
            }
          >
            {isEditVenderId ? (
              <>
                <X className="w-5 h-5" /> Close{' '}
              </>
            ) : (
              <>
                <Download className="w-5 h-5" /> Export
              </>
            )}
          </Button>
        </div>
      </DashboardHeader>
      <DashboardContent className="relative z-0 flex-col">
        {isEditVenderId ? (
          <EditVender
            nextSetItemTotal={nextSetItemTotal}
            page={page}
            setPage={setPage}
          />
        ) : (
          data && (
            <VendersList
              data={data!}
              fetchVenderList={fetchVenderList}
              nextSetItemTotal={nextSetItemTotal}
              page={page}
              setPage={setPage}
              setSearchValue={setSearchValue}
            />
          )
        )}
      </DashboardContent>
    </Dashboard>
  );
}

export default VenderList;
