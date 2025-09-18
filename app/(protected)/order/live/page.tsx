'use client';
import { orderService } from '@/shared/services/orders';
import { Grid, List, Search } from 'lucide-react';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import GridComponent from '@/features/orders/components/Livelist/GridComponent';
import ListComponent from '@/features/orders/components/Livelist/ListComponent';
import { useOrderStatusHistory } from '@/features/orders/hooks/useOrderStatusHistory';
import { TypeOrderHistoryList } from '@/shared/types/orders';
import { useOrderStore } from '@/store/useOrderStore';
import { useAuthStore, useSharedStore, useVenderStore } from '@/store';
import TableComponent from '@/features/orders/components/Livelist/TableComponent/index';
import { Input } from '@/shared/components/ui/input';
import { fleetService } from '@/shared/services/fleet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';

export default function OrderTrackingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ordernNumber, setOrdernNumber] = useState('');
  const [page, setPage] = useState(10);
  const [isStyleTabel, setIsStyleTabel] = useState<'grid' | 'list'>('grid');
  const [nextSetItemsToken, setNextSetItemsToken] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [driverList, setDriverList] = useState<any>();

  const orderStore = useOrderStore();
  const authStore = useAuthStore();
  const { driverId, setValue } = useOrderStore();
  const { isEditDetails, showDriversFilter } = useVenderStore();

  const [selectedOrder, setSelectedOrder] = useState<TypeOrderHistoryList>(
    orderStore?.orderHistoryListData?.[0] ?? ({} as TypeOrderHistoryList)
  );

  const url = useMemo(() => {
    return orderService.getOrderStatusUrl(
      1,
      page,
      ordernNumber,
      searchTerm,
      driverId!,
      authStore.user?.roles?.includes('VENDOR_USER') ? null : true
    );
  }, [page, authStore.user, ordernNumber, searchTerm, driverId]);

  const fetchOrderDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getOrderList(url);
      if (res.data) {
        orderStore.setSourceForTable('orderStatusListData', res.data);
        setSelectedOrder(res.data[0]);
      }
      setNextSetItemsToken(res.count! < page ? null : true);
    } catch (err: any) {
      console.error('Error fetching orders:', err.message || err);
    } finally {
      setIsLoading(false);
    }
  }, [page, url]);

  const fetchDriverData = useCallback(async () => {
    if (!showDriversFilter) return;
    try {
      const driverResult = await fleetService.getDriver();
      if (driverResult.data) {
        setDriverList(driverResult.data);
      }
    } catch (error: any) {
      console.error('Error fetching driver data:', error);
      setDriverList(undefined);
    }
  }, [showDriversFilter]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  useEffect(() => {
    fetchDriverData();
  }, [fetchDriverData]);

  const { statusHistory } = useOrderStatusHistory(selectedOrder);

  useEffect(() => {
    if (
      orderStore.orderStatusListData &&
      orderStore.orderStatusListData.length > 0
    ) {
      setSelectedOrder(orderStore.orderStatusListData[0]);
    }
  }, [orderStore.orderStatusListData]);

  function handleTableChange(style: 'grid' | 'list') {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setIsStyleTabel(style);
        setSelectedOrder(null);
      });
    } else {
      setIsStyleTabel(style);
      setSelectedOrder(null);
    }
  }

  const t = useTranslations('component.features.orders.live');

  return (
    <Dashboard className="h-auto">
      <DashboardHeader>
        <DashboardHeaderRight />
        {/* Search and Filter */}
        <div className="flex sm:justify-center gap-1.5 max-sm:w-full justify-between">
          {isEditDetails ? (
            <div className="flex  gap-2 max-sm:w-full flex-wrap">
              <div className="relative  max-sm:w-full">
                <Input
                  type="text"
                  placeholder={t('search.order')}
                  value={ordernNumber}
                  onChange={(e) => setOrdernNumber(e.target.value)}
                  className="!border-none !outline-none !ring-0 pr-10"
                />
              </div>
              <div className="relative max-sm:w-full">
                <Input
                  type="text"
                  placeholder={t('search.customer')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!border-none !outline-none !ring-0 pr-10"
                />
              </div>

              <div className="flex items-center justify-center gap-1.5  max-sm:w-full">
                <Select
                  value={String(driverId)}
                  onValueChange={(value) => setValue('driverId', Number(value))}
                >
                  <SelectTrigger className="sm:w-[180px]  max-sm:w-full bg-white border-none">
                    <SelectValue placeholder={t('search.driver')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">All Driver</SelectItem>
                    {driverList?.agents.map((item, idx) => (
                      <SelectItem key={idx} value={String(item.fleet_id)}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
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
          )}

          <div
            hidden={isEditDetails}
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
                    handleTableChange(item.type as typeof isStyleTabel)
                  }
                  className={cn(
                    'px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center justify-center h-full',
                    isStyleTabel === item.type
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
        {isEditDetails ? (
          <TableComponent
            page={page}
            setPage={setPage}
            fetchOrderDetails={fetchOrderDetails}
            nextSetItemTotal={nextSetItemsToken}
          />
        ) : orderStore?.orderStatusListData &&
          orderStore?.orderStatusListData?.length > 0 ? (
          <>
            {isStyleTabel === 'grid' && (
              <GridComponent
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                statusHistory={statusHistory}
              />
            )}

            {isStyleTabel === 'list' && (
              <ListComponent
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                statusHistory={statusHistory}
              />
            )}
          </>
        ) : (
          'Empty'
        )}
      </DashboardContent>
    </Dashboard>
  );
}
