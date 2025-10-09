'use client';
import EditVendor from '@/features/vendor/components/list/EditVendor';
import VendorsList from '@/features/vendor/components/list/VendorsList';
import Export from '@/shared/components/Export';
import { TableFallback } from '@/shared/components/fetch/fallback';
import NoData from '@/shared/components/fetch/NoData';
import { Button } from '@/shared/components/ui/button';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { vendorService } from '@/shared/services/vendor';
import { TypeVendorList } from '@/shared/types/vendor';
import { useVendorStore } from '@/store';
import { Search, X } from 'lucide-react';
import { useCallback, useEffect, useState, type JSX } from 'react';

function VendorList(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>(null);
  const {
    isEditVendorId: isEditVendorId,
    getVendorAccountManagerId,
    setValue,
  } = useVendorStore();

  const [searchValue, setSearchValue] = useState<string | null>('');
  const [data, setData] = useState<TypeVendorList | undefined>(undefined);

  // Updated main function

  const fetchVendorList = useCallback(async (): Promise<void> => {
    try {
      getVendorAccountManagerId();
      const url = vendorService.setVendorListUrl(page, searchValue, null);

      try {
        const res = await vendorService.getVendorList(url);
        setData(res.data);
        setNextSetItemTotal(res.data.length < page ? null : true);
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
    const loadFetchVendorList = async () => {
      await fetchVendorList();
    };
    loadFetchVendorList();
  }, [fetchVendorList]);

  if (isLoading) return <TableFallback />;

  return (
    <Dashboard className="">
      <DashboardHeader>
        <DashboardHeaderRight
          title={isEditVendorId && 'Edit Vendor Details'}
          subtitle={isEditVendorId && 'Manage Vendor Information'}
        />

        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between max-sm:flex-wrap">
          <div hidden={!!isEditVendorId} className="relative max-sm:w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={'Search Vendor'}
              value={searchValue!}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0 "
            />
          </div>
          <Button
            // onClick={() => exportOrdersToCSV(data!, 'balance-report', ``)}
            //   onClick={() => vendorStore.setValue('isEditVendorId', undefined)}
            variant={!isEditVendorId ? 'ghost' : 'default'}
            onClick={() =>
              isEditVendorId ? setValue('isEditVendorId', undefined) : ''
            }
            className={cn(!isEditVendorId && 'p-0')}
          >
            {isEditVendorId ? (
              <>
                <X className="w-5 h-5" /> Close{' '}
              </>
            ) : (
              <Export
                data={data!}
                title="Vendor List"
                exclude={['main_branch-main_branch']}
              />
            )}
          </Button>
        </div>
      </DashboardHeader>
      <DashboardContent className="relative z-0 flex-col">
        {isEditVendorId ? (
          <EditVendor
            nextSetItemTotal={nextSetItemTotal}
            page={page}
            setPage={setPage}
          />
        ) : data ? (
          <VendorsList
            data={data!}
            nextSetItemTotal={nextSetItemTotal}
            setPage={setPage}
          />
        ) : (
          <NoData />
        )}
      </DashboardContent>
    </Dashboard>
  );
}

export default VendorList;
