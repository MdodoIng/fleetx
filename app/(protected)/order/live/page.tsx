'use client';
import { orderService } from '@/shared/services/orders';
import { Grid, List, Search } from 'lucide-react';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import GridComponent from '@/features/orders/components/LiveList/GridComponent';
import ListComponent from '@/features/orders/components/LiveList/ListComponent';
import TableComponent from '@/features/orders/components/LiveList/TableComponent';
import { useOrderStatusHistory } from '@/features/orders/hooks/useOrderStatusHistory';
import { TableFallback } from '@/shared/components/fetch/fallback';
import NoData from '@/shared/components/fetch/NoData';
import DriverSelect from '@/shared/components/selectors/DriverSelect';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Input } from '@/shared/components/ui/input';
import useMediaQuery from '@/shared/lib/hooks/useMediaQuery';
import { cn } from '@/shared/lib/utils';
import {
  TypeOrderHistoryList,
  TypeRootLiveOrderList,
} from '@/shared/types/orders';
import { useAuthStore, useVendorStore } from '@/store';
import { useOrderStore } from '@/store/useOrderStore';
import { useTranslations } from 'next-intl';

export default function OrderTrackingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [page, setPage] = useState(10);
  const [isStyleTable, setIsStyleTable] = useState<'grid' | 'list'>('grid');
  const [nextSetItemsToken, setNextSetItemsToken] = useState<number | null>();
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDriver, setSelectedDriver] = useState<string>();
  const isMobile = useMediaQuery('lg');

  const orderStore = useOrderStore();
  const authStore = useAuthStore();

  const { isEditDetails, vendorId, branchId } = useVendorStore();

  const [selectedOrder, setSelectedOrder] = useState<
    TypeOrderHistoryList | undefined
  >(orderStore?.orderHistoryListData?.[0] ?? ({} as TypeOrderHistoryList));

  const url = useMemo(() => {
    return orderService.getOrderStatusUrl(
      1,
      isEditDetails ? page : null,
      orderNumber,
      searchTerm,
      selectedDriver!,
      authStore.user?.roles?.includes('VENDOR_USER') ? null : true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    orderNumber,
    searchTerm,
    selectedDriver,
    authStore.user?.roles,
    isEditDetails,
    branchId,
    vendorId,
  ]);

  const fetchOrderDetails = useCallback(async () => {
    try {
      // @ts-ignore
      const res: TypeRootLiveOrderList = await orderService.getOrderList(url);
      if (res.data) {
        orderStore.setSourceForTable('orderStatusListData', res.data);
        // @ts-ignore
        setSelectedOrder(res.data[0]);
      }
      console.log(res);

      setIsLoading(false);
      setTimeout(() => {
        setNextSetItemsToken(
          // @ts-ignore
          res.count ? (res.count <= res.data.length ? null : true) : null
        );
      }, 1000);

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const { statusHistory } = useOrderStatusHistory(selectedOrder!);

  useEffect(() => {
    if (
      orderStore.orderStatusListData &&
      orderStore.orderStatusListData.length > 0
    ) {
      setSelectedOrder(orderStore.orderStatusListData[0]);
    }
  }, [orderStore.orderStatusListData]);

  function handleTableChange(style: 'grid' | 'list') {
    setIsStyleTable(style);
    setSelectedOrder(undefined);
  }

  const t = useTranslations('component.features.orders.live');

  if (isLoading) return <TableFallback />;

  return (
    <Dashboard className="h-auto">
      <DashboardHeader>
        <DashboardHeaderRight />
        {/* Search and Filter */}
        <div className="flex sm:justify-center gap-1.5 max-sm:w-full flex-wrap justify-between">
          <div className="relative max-sm:w-full">
            <Input
              type="text"
              placeholder={t('search.order')}
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="!border-none !outline-none !ring-0 pr-10"
            />
          </div>
          <div className="relative max-sm:w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={t('search.default')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0 pr-10"
            />
          </div>

          {isEditDetails && (
            <DriverSelect
              value={selectedDriver!}
              onChangeAction={setSelectedDriver}
            />
          )}

          <div
            hidden={isEditDetails || isMobile}
            className="flex items-center justify-center border broder-[#2828281A] rounded-md"
            style={{
              border: '1px solid #2828281A',
            }}
          >
            {[
              { type: 'grid', icon: Grid },
              { type: 'list', icon: List },
            ].map((item, idx) => (
              <Fragment key={idx}>
                <button
                  onClick={() =>
                    handleTableChange(item.type as typeof isStyleTable)
                  }
                  className={cn(
                    'px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center justify-center h-full',
                    isStyleTable === item.type
                      ? ' bg-[#EEF6FE] text-primary-blue'
                      : ' bg-transparent text-dark-grey'
                  )}
                >
                  <item.icon className="w-5 h-5 " />
                </button>
                <span className="h-full flex bg-[#2828281A] w-0.5 last:hidden" />
              </Fragment>
            ))}
          </div>
        </div>
      </DashboardHeader>
      <DashboardContent className="flex w-full">
        {orderStore?.orderStatusListData &&
        orderStore?.orderStatusListData?.length > 0 ? (
          <>
            {isEditDetails ? (
              <TableComponent
                setPage={setPage}
                fetchOrderDetails={fetchOrderDetails}
                nextSetItemTotal={nextSetItemsToken}
              />
            ) : (
              <>
                {isStyleTable === 'grid' && (
                  <GridComponent
                    selectedOrder={selectedOrder!}
                    setSelectedOrder={setSelectedOrder}
                    statusHistory={statusHistory}
                  />
                )}

                {isStyleTable === 'list' && (
                  <ListComponent
                    selectedOrder={selectedOrder!}
                    setSelectedOrder={setSelectedOrder}
                    statusHistory={statusHistory}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <NoData />
        )}
      </DashboardContent>
    </Dashboard>
  );
}
