'use client';
import { paymentMap } from '@/features/orders/constants';
import { InsightsFallback } from '@/shared/components/fetch/fallback';
import { ActiveOrdersIcon } from '@/shared/components/icons/layout';
import DateSelect from '@/shared/components/selectors/DateSelect';
import DriverSelect from '@/shared/components/selectors/DriverSelect';
import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardIcon,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import {
  Table,
  TableLists,
  TableSingleList,
  TableSingleListContent,
  TableSingleListContentDetailsItem,
  TableSingleListContentDetailsTitle,
  TableSingleListContentTitle,
  TableSingleListContents,
  TableSingleListHeader,
  TableSingleListHeaderLeft,
  TableSingleListHeaderRight,
} from '@/shared/components/ui/tableList';
import { cn } from '@/shared/lib/utils';
import { orderService } from '@/shared/services/orders';
import { TypeRootLiveBuilkOrderListInsights } from '@/shared/types/orders';
import { useVendorStore } from '@/store';
import {
  CheckCircle,
  Clock,
  CreditCard,
  Dot,
  Info,
  MapPin,
  Navigation,
  Phone,
  Receipt,
  Truck,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

export default function BulkInsightsDashboard() {
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(),
  });
  const [selectedDriver, setSelectedDriver] = useState<string>();

  const [bulkInsightsData, setBulkInsightsData] = useState({
    created_count: 0,
    active_rescheduled_count: 0,
    total_rescheduled_count: 0,
    delivered_count: 0,
    canceled_count: 0,
    delivery_failed_count: 0,
  });

  const [ordersList, setOrdersList] = useState([
    {
      id: 1,
      mashkor_order_number: 'MKR001234',
      order_number: 'ORD001',
      customer_name: 'Ahmed Al-Rashid',
      phone_number: '+965 9999 8888',
      customer_name_sender: 'Sarah Kuwait',
      phone_number_sender: '+965 7777 6666',
      primary_status: 85,
      status: 'In Delivery',
      class_status: 'in_delivery',
      from: 'Kuwait City, Block 5, Street 10',
      to: 'Hawally, Block 2, Street 15',
      driver_name: 'Mohammed Ali',
      driver_phone: '+965 5555 4444',
      amount_collected: 15.75,
      delivery_fee: 2.5,
      payment_type: 1,
      delivery_distance: 12.5,
      delivered_date: null,
      canceled_at: null,
      status_change_reason: null,
      is_addr_last_updated_by_customer: true,
      is_delivery_address_edit_enabled: true,
    },
    {
      id: 2,
      mashkor_order_number: 'MKR001235',
      order_number: 'ORD002',
      customer_name: 'Fatima Al-Sabah',
      phone_number: '+965 9999 7777',
      customer_name_sender: 'Ali Kuwait',
      phone_number_sender: '+965 8888 5555',
      primary_status: 100,
      status: 'Delivered',
      class_status: 'delivered',
      from: 'Salmiya, Block 1, Street 5',
      to: 'Jabriya, Block 7, Street 20',
      driver_name: 'Hassan Ahmed',
      driver_phone: '+965 6666 3333',
      amount_collected: 25.0,
      delivery_fee: 3.0,
      payment_type: 2,
      delivery_distance: 18.2,
      delivered_date: '2024-01-15T14:30:00Z',
      canceled_at: null,
      status_change_reason: null,
      is_addr_last_updated_by_customer: false,
      is_delivery_address_edit_enabled: false,
    },
  ]);

  const { showDriversFilter } = useVendorStore();

  const BUDDY_QUEUED = 15;
  const currencyCode = 'KWD';

  const getStatusBadgeVariant = (status) => {
    const variants = {
      new: 'secondary',
      confirmed: 'outline',
      assigned: 'outline',
      pickup_started: 'outline',
      picked_up: 'outline',
      in_delivery: 'default',
      arrived_destination: 'outline',
      delivered: 'default',
      canceled: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  const fetchBulkInsightsData = useCallback(async () => {
    try {
      const url = orderService.getBulkInsightsUrl(
        date?.from,
        date?.to,
        selectedDriver
      );
      const res: TypeRootLiveBuilkOrderListInsights =
        await orderService.getOrderList(url);
      if (!res.data) {
        throw new Error(`HTTP error! status: ${res}`);
      }

      setBulkInsightsData(res.data.insights);
      setOrdersList(res.data.orders_list);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bulk insights data:', error);
      // Handle error appropriately, e.g., display an error message to the user.
    }
  }, [date?.from, date?.to, selectedDriver]);

  useEffect(() => {
    fetchBulkInsightsData();
  }, [fetchBulkInsightsData]);

  const insightArray = [
    {
      label: 'Created',
      value: bulkInsightsData.created_count,
      icon: ActiveOrdersIcon,
    },
    {
      label: 'Active Rescheduled',
      value: bulkInsightsData.active_rescheduled_count,
      icon: ActiveOrdersIcon,
    },
    {
      label: 'Total Rescheduled',
      value: bulkInsightsData.total_rescheduled_count,

      icon: ActiveOrdersIcon,
    },
    {
      label: 'Delivered',
      value: bulkInsightsData.delivered_count,

      icon: ActiveOrdersIcon,
    },
    {
      label: 'Canceled',
      value: bulkInsightsData.canceled_count,
      icon: ActiveOrdersIcon,
    },
    {
      label: 'Delivery Failed',
      value: bulkInsightsData.delivery_failed_count,

      icon: ActiveOrdersIcon,
    },
  ];

  if (loading) return <InsightsFallback />;

  return (
    <Dashboard className="">
      <DashboardHeader>
        <DashboardHeaderRight />
        {/* Search and Filter */}
        <div className="flex sm:justify-center gap-1.5 max-sm:w-full justify-between">
          {showDriversFilter && (
            <DriverSelect
              value={selectedDriver!}
              onChangeAction={setSelectedDriver}
            />
          )}
          <DateSelect value={date} onChangeAction={setDate} />
        </div>
      </DashboardHeader>
      <DashboardContent className="flex w-full flex-col items-center justify-start">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 w-full">
          {insightArray.map((insight) => (
            <Card key={insight.label} className="py-4">
              <CardContent className="gap-6 flex flex-col px-4">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className={cn('text-sm opacity-70')}>
                    {insight.label}
                  </CardTitle>
                  <CardIcon>
                    <insight.icon className="!text-dark-grey" />
                  </CardIcon>
                </div>
                <CardContent className="px-0">
                  <CardDescription className={cn('text-2xl font-medium')}>
                    {insight.value}
                  </CardDescription>
                </CardContent>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4 max-h-[1000px] overflow-y-auto w-full">
          {ordersList.length > 0 ? (
            <Table>
              <TableLists>
                {ordersList?.map((order, idx) => (
                  <TableSingleList key={idx}>
                    <TableSingleListHeader className="">
                      <TableSingleListHeaderRight>
                        <span className="font-semibold text-primary-blue flex">
                          <p className="ltr:hidden">FleetX #</p>
                          {order.mashkor_order_number}
                          <p className="rtl:hidden"># FleetX</p>
                        </span>
                        <Badge
                          variant={
                            getStatusBadgeVariant?.(order.class_status) ||
                            'default'
                          }
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                        <span className="text-xs text-primary-teal flex items-center">
                          <Dot />
                          {order.branch_name || order.order_number}
                        </span>
                      </TableSingleListHeaderRight>
                      <TableSingleListHeaderLeft className="flex items-center gap-2">
                        {/* Rating component from prompt is omitted as it's not defined or imported */}
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {order.delivered_date ||
                            order.canceled_at ||
                            order.creation_date}
                        </div>
                      </TableSingleListHeaderLeft>
                    </TableSingleListHeader>

                    <TableSingleListContents>
                      {/* Order Number */}
                      <TableSingleListContent>
                        <TableSingleListContentTitle>
                          <Receipt size={14} />
                          Order No
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle>
                          {order.mashkor_order_number}
                        </TableSingleListContentDetailsTitle>
                        {order.status_change_reason &&
                          order.primary_status === 120 && (
                            <TableSingleListContentDetailsItem className="text-red-500 font-semibold">
                              {order.status_change_reason}
                            </TableSingleListContentDetailsItem>
                          )}
                      </TableSingleListContent>

                      {/* Sender */}
                      <TableSingleListContent>
                        <TableSingleListContentTitle>
                          <User size={14} />
                          Sender
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle>
                          {order.customer_name_sender}
                        </TableSingleListContentDetailsTitle>
                        <TableSingleListContentDetailsItem>
                          <Phone size={12} />
                          {order.phone_number_sender}
                        </TableSingleListContentDetailsItem>
                        <TableSingleListContentDetailsItem>
                          <MapPin size={12} />
                          {order.from?.slice(0, 50)}
                        </TableSingleListContentDetailsItem>
                      </TableSingleListContent>

                      {/* Receiver */}
                      <TableSingleListContent>
                        <TableSingleListContentTitle>
                          <User size={14} />
                          Receiver
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle>
                          {order.customer_name}
                        </TableSingleListContentDetailsTitle>
                        <TableSingleListContentDetailsItem>
                          <Phone size={12} />
                          {order.phone_number}
                        </TableSingleListContentDetailsItem>
                        <TableSingleListContentDetailsItem>
                          <MapPin size={12} />
                          {order.to?.slice(0, 50)}
                          {order.is_addr_last_updated_by_customer && (
                            <CheckCircle className="h-3 w-3 text-teal-500 ml-1" />
                          )}
                        </TableSingleListContentDetailsItem>
                        {order.is_delivery_address_edit_enabled && (
                          <EditResiver data={order} />
                        )}
                        {/* EditResiver component from prompt is omitted as it's not defined or imported */}
                      </TableSingleListContent>

                      {/* Driver Info */}
                      <TableSingleListContent
                        className={
                          order.primary_status === BUDDY_QUEUED
                            ? 'bg-[#F9F8714D]'
                            : ''
                        }
                      >
                        {order.primary_status === BUDDY_QUEUED ? (
                          <>
                            <TableSingleListContentTitle className="text-[#915A0B]">
                              <Clock size={14} className="!text-[#915A0B]" />
                              Buddy Queued
                            </TableSingleListContentTitle>
                            <TableSingleListContentDetailsItem>
                              Buddy will pick up your order
                            </TableSingleListContentDetailsItem>
                          </>
                        ) : order.driver_name ? (
                          <>
                            <TableSingleListContentTitle>
                              <Truck size={14} />
                              Driver
                            </TableSingleListContentTitle>
                            <TableSingleListContentDetailsTitle className="text-sm font-medium text-gray-800">
                              {order.driver_name}
                            </TableSingleListContentDetailsTitle>
                            <TableSingleListContentDetailsItem>
                              <Phone size={12} />
                              {order.driver_phone}
                            </TableSingleListContentDetailsItem>
                            <TableSingleListContentDetailsItem>
                              <Navigation size={12} />
                              {order.delivery_distance?.toFixed(1)} km
                            </TableSingleListContentDetailsItem>
                          </>
                        ) : (
                          <>
                            <TableSingleListContentTitle className="text-[#915A0B]">
                              <Clock size={14} className="!text-[#915A0B]" />
                              No Driver Assigned
                            </TableSingleListContentTitle>
                            <TableSingleListContentDetailsItem>
                              Driver queued for assignment
                            </TableSingleListContentDetailsItem>
                          </>
                        )}
                      </TableSingleListContent>

                      {/* Delivery Fee */}
                      <TableSingleListContent>
                        <TableSingleListContentTitle>
                          <Info size={14} />
                          Delivery Fee
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle>
                          {order.delivery_fee?.toFixed(3)} {currencyCode}
                        </TableSingleListContentDetailsTitle>
                        {/* The prompt shows amount_collected here, but based on original context, delivery_fee seems more appropriate for "Delivery Fee" section */}
                      </TableSingleListContent>

                      {/* Payment Info */}
                      <TableSingleListContent>
                        <TableSingleListContentTitle>
                          <CreditCard size={14} />
                          Payment
                        </TableSingleListContentTitle>
                        <TableSingleListContentDetailsTitle>
                          {paymentMap[order.payment_type] || 'Unknown'}
                        </TableSingleListContentDetailsTitle>
                        <TableSingleListContentDetailsItem>
                          <Info size={12} />
                          COD: {order.amount_collected?.toFixed(3)}{' '}
                          {currencyCode}
                        </TableSingleListContentDetailsItem>
                        {/* EditPayment component from prompt is omitted as it's not defined or imported */}
                      </TableSingleListContent>

                      {/* The original Distance section is removed as distance is now under Driver Info */}
                    </TableSingleListContents>
                  </TableSingleList>
                ))}
              </TableLists>
            </Table>
          ) : (
            ''
          )}
        </div>
      </DashboardContent>
    </Dashboard>
  );
}
