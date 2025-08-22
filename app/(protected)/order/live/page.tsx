'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Phone,
  MapPin,
  Clock,
  Package,
  User,
  CheckCircle,
  AlertCircle,
  Truck,
  Navigation,
  Grid,
  List,
  Map,
  LocateFixed,
  ShipWheel,
  Circle,
} from 'lucide-react';
import { orderService } from '@/features/orders/services/ordersApi';

import {
  OrderStatus,
  OrderStatusMappingForTick,
  TypeLiveOrderItem,
  TypeOrderHistoryList,
  TypeOrderStatusHistoryHistory,
  TypeRootLiveOrderList,
  TypeStatusHistoryForUi,
} from '@/shared/types/orders';
import { useOrderStore } from '@/store/useOrderStore';
import MyMap from '@/shared/components/MyMap/Map';
import { useOrderStatusHistory } from '@/features/orders/hooks/useOrderStatusHistory';

export default function OrderTrackingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  const [ordernNumber, setOrdernNumber] = useState('');
  const orderStore = useOrderStore();

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
  const [nextSetItemsToken, setNextSetItemsToken] = useState<
    string[] | undefined
  >(undefined);
  const [orderHistorys, setOrderHistorys] =
    useState<TypeOrderStatusHistoryHistory>();

  const [selectedOrder, setSelectedOrder] = useState<TypeOrderHistoryList>(
    orderStore?.orderHistoryListData &&
      orderStore?.orderHistoryListData.length > 0
      ? orderStore?.orderHistoryListData[0]
      : ({} as TypeOrderHistoryList)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isStyleTabel, setIsStyleTabel] = useState<'grid' | 'list'>('grid');

  const fetchOrderDetails = async (perPage: number, clearData: boolean) => {
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

      console.log(res.data[0].delivery_duration, 'afads');

      orderStore.setSourceForTable(res.data);
      setSelectedOrder(
        orderStore.orderHistoryListData
          ? orderStore.orderHistoryListData[0]
          : ({} as TypeOrderHistoryList)
      );

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
      await fetchOrderDetails(20, true);
    };
    loadInitialOrders();
  }, []);

  const { statusHistory, loading, error, refetch } =
    useOrderStatusHistory(selectedOrder);

  // useEffect(() => {
  //   // Refetch when selectedOrder.id changes
  //   refetch();
  // }, [selectedOrder.id, refetch]);

  console.log(orderStore.orderHistoryListData);

  const statusMap: Record<string, string> = {
    'orderStatus.CONFIRMED': 'Confirmed Orders',
    'orderStatus.DRIVER_ASSIGNED': 'Drivers Coming to You',
    'orderStatus.BUDDY_QUEUED': 'Waiting for Pickup',
    'orderStatus.IN_DELIVERY': 'In Delivery',
  };

  const grouped = orderStore.orderHistoryListData!.reduce(
    (acc: Record<string, TypeOrderHistoryList[]>, order) => {
      const col = statusMap[order.status] || 'Confirmed Orders';
      if (!acc[col]) acc[col] = [];
      acc[col].push(order);
      return acc;
    },
    {}
  );

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
          <div className="flex gap-2 border bg-white rounded-md">
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

      {isStyleTabel === 'grid' && (
        <div className="grid grid-cols-3 w-full gap-4 h-full">
          <div className="w-full bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
            {/* Header */}

            {/* Orders Header */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Orders</h3>
              <p className="text-xs text-gray-500 mt-1">
                Find a live or an active orders
              </p>
            </div>

            {/* Orders List */}
            <div className="flex-1 overflow-y-auto">
              {orderStore.orderHistoryListData?.map((order, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      viewTransitionName: order.fleetx_order_number,
                    }}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 flex items-start justify-between transition-colors ${
                      selectedOrder?.id === order.id
                        ? 'bg-blue-50 border-l-4 border-l-blue-500'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {order.fleetx_order_number}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.customer_name}
                      </p>
                      <p className=" text-gray-500 text-sm flex items-center mt-6">
                        <MapPin size={16} />
                        {order.to}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 flex-col h-full">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-red-400 ml-auto`}
                      >
                        {order.class_status}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{order.delivery_duration} Mins</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Panel - Live Tracking Map */}
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Map Header */}
            <div className="p-6 bg-white border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Live Tracking
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Live location updates right here
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-4 w-full max-w-md space-y-4 mt-3">
              {/* Order ID */}
              <div className="text-gray-700 font-semibold">
                {selectedOrder?.fleetx_order_number}
              </div>

              {/* Pickup Location */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl  text-green-300 flex items-center justify-center">
                  <MapPin className="w-5 h-5  text-green-300" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {selectedOrder?.customer_name_sender}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedOrder?.from}
                  </div>
                </div>
                <button className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
                  <Phone className="w-4 h-4" />{' '}
                  {selectedOrder?.phone_number_sender}
                </button>
              </div>

              {/* Drop-off Location */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <LocateFixed className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {selectedOrder?.customer_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedOrder?.to}
                  </div>
                </div>
                <button className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
                  <Phone className="w-4 h-4" /> {selectedOrder?.phone_number}
                </button>
              </div>

              <hr />

              {/* Driver Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <ShipWheel className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Driver</div>
                    <div className="font-medium text-gray-900">
                      {selectedOrder?.driver_name}
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-600 rounded-lg font-medium">
                  <Phone className="w-4 h-4" /> Call Driver
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative bg-gray-100 mt-3 rounded-md shadow ">
              {/* Mock Map */}
              <MyMap
                center={[
                  {
                    lat: Number(selectedOrder?.pick_up.latitude),
                    lng: Number(selectedOrder?.pick_up.longitude),
                  },
                  {
                    lat: Number(selectedOrder?.drop_off.latitude),
                    lng: Number(selectedOrder?.drop_off.longitude),
                  },
                ]}
              />
            </div>
          </div>

          {/* Right Panel - Order Details */}

          <div className="bg-white rounded-xl shadow-sm p-4 w-full max-w-sm">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500">Order Details</p>
                <p className="text-lg font-semibold">
                  {selectedOrder.customer_name}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedOrder.payment_type === 2 ? 'K-Net (Paid)' : 'Cash'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {selectedOrder.fleetx_order_number}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedOrder.delivery_fee} KD
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-4 space-y-5">
              {statusHistory
                .filter((s) => s.display)
                .map((status) => (
                  <div key={status.id} className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 rounded-full ${
                          status.completed
                            ? 'bg-purple-600'
                            : 'border border-gray-300'
                        }`}
                      />
                      <div className="h-6 w-px bg-gray-200" />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          status.completed ? 'text-purple-600' : 'text-gray-500'
                        }`}
                      >
                        {status.text}
                      </p>
                      {status.time && (
                        <p className="text-xs text-gray-400">
                          {new Date(status.time).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {isStyleTabel === 'list' && (
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 min-h-screen">
          {Object.entries(statusMap).map(([key, label]) => (
            <div
              key={key}
              className="bg-white rounded-lg p-4 shadow-sm flex flex-col"
            >
              <h2 className="text-sm font-semibold">{label}</h2>
              <p className="text-xs text-gray-500 mb-2">
                All your {label.toLowerCase()}
              </p>

              {grouped[label]?.map((order) => (
                <div
                  style={{
                    viewTransitionName: order.fleetx_order_number,
                  }}
                  key={order.fleetx_order_number}
                  className={`rounded-lg border p-3 mb-3 flex  ${
                    order.class_status === 'CONFIRMED'
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {order.fleetx_order_number}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.customer_name}
                    </p>
                    <p className=" text-gray-500 text-sm flex items-center mt-6">
                      <MapPin size={16} />
                      {order.to}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 flex-col h-full">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-red-400 ml-auto`}
                    >
                      {order.class_status}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{order.delivery_duration} Mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
