'use client';
import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import { vendorService } from '@/shared/services/vender';
import { TypeVenderList } from '@/shared/types/vender';
import { useVenderStore } from '@/store';
import { useEffect, useState, type JSX } from 'react';
import VendersList from '@/features/vendor/components/list/VendersList';
import EditVender from '@/features/vendor/components/list/EditVender';

function VenderList(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<any>(null);
  const { isEditVenderId, getVendorAccountManagerId, setValue } =
    useVenderStore();
  const [isCentralWallet, setIsCentralWallet] = useState(false);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [data, setData] = useState<TypeVenderList | undefined>(undefined);

  // Updated main function
  const fetchVenderList = async (): Promise<void> => {
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
  };

  useEffect(() => {
    const loadFetchVenderList = async () => {
      await fetchVenderList();
    };
    loadFetchVenderList();
  }, [page, isEditVenderId]);

  console.log(data, 'aeefeafsafaaf');

  const { exportOrdersToCSV } = useTableExport();

  console.log();

  return (
    <div className="flex bg-gray-50 flex-col items-center overflow-hidden">
      {/* Left Panel - Orders List */}

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
    </div>
  );
}

export default withAuth(VenderList, [
  'OPERATION_MANAGER',
  'VENDOR_ACCOUNT_MANAGER',
  'SALES_HEAD',
]);
