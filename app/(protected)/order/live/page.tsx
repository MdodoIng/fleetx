'use client';
import { orderService } from '@/shared/services/orders';
import { Grid, List, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import GridComponent from '@/features/orders/components/Livelist/GridComponent';
import ListComponent from '@/features/orders/components/Livelist/ListComponent';
import { useOrderStatusHistory } from '@/features/orders/hooks/useOrderStatusHistory';
import {
  TypeOrderHistoryList,
  TypeOrderStatusHistoryHistory,
} from '@/shared/types/orders';
import { useOrderStore } from '@/store/useOrderStore';
import { useAuthStore, useVenderStore } from '@/store';
import TableComponent from '@/features/orders/components/Livelist/TableComponent/index';
import LoadingPage from '../../loading';
import { Input } from '@/shared/components/ui/input';
import { fleetService } from '@/shared/services/fleet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export default function OrderTrackingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  const [ordernNumber, setOrdernNumber] = useState('');
  const orderStore = useOrderStore();
  const venderStore = useVenderStore();
  const authStore = useAuthStore();
  const [searchCustomer, setSearchCustomer] = useState('');

  const [nextSetItemsToken, setNextSetItemsToken] = useState<any>();

  const [selectedOrder, setSelectedOrder] = useState<TypeOrderHistoryList>(
    orderStore?.orderHistoryListData &&
      orderStore?.orderHistoryListData.length > 0
      ? orderStore?.orderHistoryListData[0]
      : ({} as TypeOrderHistoryList)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const { driverId, setValue } = useOrderStore();
  const [driverList, setDriverList] =
    useState<TypeFleetDriverResponse['data']>();

  const [isStyleTabel, setIsStyleTabel] = useState<'grid' | 'list'>('grid');

  const isOrderLiveIsTable =
    authStore.user?.roles?.some((role) =>
      [
        'OPERATION_MANAGER',
        'FINANCE_MANAGER',
        'VENDOR_ACCOUNT_MANAGER',
        'SALES_HEAD',
      ].includes(role as any)
    ) ?? false;

  const fetchOrderDetails = async () => {
    setIsLoading(true);

    const searchAll = authStore.user?.roles.includes('FINANCE_MANAGER')
      ? null
      : true;

    const url = orderService.getOrderStatusUrl(
      1,
      page,
      ordernNumber,
      searchCustomer,
      driverId!,
      searchAll
    );

    try {
      const res = await orderService.getOrderList(url);

      if (res.data) {
        orderStore.setSourceForTable('orderStatusListData', res.data);
        if (orderStore.orderStatusListData) {
          console.log(orderStore.orderStatusListData, 'fafa');
          setSelectedOrder(orderStore.orderStatusListData[0]);
        }
      }
      setNextSetItemsToken(res.count! < page ? null : true);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);

      // Replace `this.sharedService.showServerMessage` and `this.sharedService.logError`
      const errorMessage =
        err.error?.message ||
        err.message ||
        'An unknown error occurred while fetching orders.';

      console.error('Error in fetchOrderDetails:', errorMessage);
    }
  };

  const fetchDriverData = async () => {
    if (!isOrderLiveIsTable) return;

    try {
      const driverResult = await fleetService.getDriver();

      if (driverResult.data) {
        setDriverList(driverResult.data);
      }
    } catch (error: any) {
      console.error('Error fetching driver data:', error);
      setDriverList(undefined);
    }
  };

  useEffect(() => {
    const loadInitialOrders = async () => {
      await fetchOrderDetails();
    };
    loadInitialOrders();
  }, [
    venderStore.selectedBranch?.id,
    page,
    venderStore.selectedVendor?.id,
    driverId,
    searchCustomer,
    ordernNumber,
  ]);

  useEffect(() => {
    fetchDriverData();
  }, [isOrderLiveIsTable]);

  const { statusHistory } = useOrderStatusHistory(
    selectedOrder,
    isOrderLiveIsTable
  );

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
      });
    } else {
      setIsStyleTabel(style);
    }
  }

  return (
    <div className="flex bg-gray-50 flex-col items-center overflow-hidden">
      {/* Left Panel - Orders List */}

      <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
        {!isOrderLiveIsTable && (
          <div className="flex items-center justify-between ">
            <h2 className="text-xl font-semibold text-gray-900">
              Active Orders
            </h2>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex items-center justify-center gap-1.5">
          {isOrderLiveIsTable ? (
            <div className="flex items-center gap-5">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search Order No"
                  value={ordernNumber}
                  onChange={(e) => setOrdernNumber(e.target.value)}
                  className=""
                />
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search Customer"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  className=""
                />
              </div>

              <div className="flex items-center justify-center gap-1.5">
                <Select
                  value={String(driverId)}
                  onValueChange={(value) => setValue('driverId', Number(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select an Driver" />
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by Order No, Customer, Phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 "
              />
            </div>
          )}

          <div
            hidden={isOrderLiveIsTable}
            className="flex gap-2 border bg-white rounded-md"
          >
            <button
              onClick={() => handleTableChange('grid')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Grid className="w-5 h-5 text-gray-600" />
            </button>
            <span className="h-auto bg-gray-200 w-0.5 " />
            <button
              onClick={() => handleTableChange('list')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <List className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {isOrderLiveIsTable ? (
        <TableComponent
          data={orderStore?.orderStatusListData!}
          isRating={false}
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
              orders={orderStore?.orderStatusListData!}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              statusHistory={statusHistory}
            />
          )}

          {isStyleTabel === 'list' && (
            <ListComponent
              data={orderStore?.orderStatusListData!}
              statusHistory={statusHistory}
            />
          )}
        </>
      ) : (
        'Empty'
      )}
    </div>
  );
}
