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

export default function OrderTrackingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  const [ordernNumber, setOrdernNumber] = useState('');
  const orderStore = useOrderStore();
  const venderStore = useVenderStore();
  const authStore = useAuthStore();

  const [isEditDetails, setIsEditDetails] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState<Date | undefined>(
    undefined
  );
  const [selectedToDate, setSelectedToDate] = useState<Date | undefined>(
    undefined
  );
  const [searchOrder, setSearchOrder] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchDriver, setSearchDriver] = useState('');
  const [selectedAccountManager, setSelectedAccountManager] = useState<
    string | undefined
  >(undefined);
  const [selectedSorting, setSelectedSorting] = useState<string | undefined>(
    undefined
  );

  const [selectedOrder, setSelectedOrder] = useState<TypeOrderHistoryList>(
    orderStore?.orderHistoryListData &&
      orderStore?.orderHistoryListData.length > 0
      ? orderStore?.orderHistoryListData[0]
      : ({} as TypeOrderHistoryList)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isStyleTabel, setIsStyleTabel] = useState<'grid' | 'list'>('grid');

  const fetchOrderDetails = async (perPage: number) => {
    setIsLoading(true);

    const searchAll = isEditDetails ? null : true;

    const url = orderService.getOrderStatusUrl(
      page,
      perPage,
      ordernNumber,
      searchCustomer,
      searchDriver,
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
      // setNextSetItemsToken(res.NEXT_SET_ITEMS_TOKEN || null);
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

  useEffect(() => {
    const loadInitialOrders = async () => {
      await fetchOrderDetails(20);
    };
    loadInitialOrders();
  }, [venderStore.branchId]);

  const isOrderLiveIsTable =
    authStore.user?.roles.includes('OPERATION_MANAGER');

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
      });
    } else {
      setIsStyleTabel(style);
    }
  }

  if (isLoading || !orderStore.orderStatusListData) return <LoadingPage />;

  console.log(selectedOrder.id);

  return (
    <div className="flex bg-gray-50 flex-col items-center overflow-hidden">
      {/* Left Panel - Orders List */}

      <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
        <div className="flex items-center justify-between ">
          <h2 className="text-xl font-semibold text-gray-900">Active Orders</h2>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center justify-center gap-1.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Order No, Customer, Phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className=" px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>All Orders</option>
            <option>Active</option>
            <option>Confirmed</option>
            <option>Urgent</option>
          </select>
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
        />
      ) : (
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
            <ListComponent data={orderStore?.orderStatusListData!} />
          )}
        </>
      )}
    </div>
  );
}
