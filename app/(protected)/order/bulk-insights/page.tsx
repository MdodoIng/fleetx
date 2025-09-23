'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardIcon,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import {
  Phone,
  User,
  MapPin,
  Truck,
  Clock,
  Copy,
  Edit2,
  CheckCircle,
  Search,
  CalendarIcon,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { useOrderStore, useVenderStore } from '@/store';
import { fleetService } from '@/shared/services/fleet';
import { useTranslations } from 'next-intl';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/shared/components/ui/calendar';
import { orderService } from '@/shared/services/orders';
import { TypeRootLiveBuilkOrderListInsights } from '@/shared/types/orders';
import { ActiveOrdersIcon } from '@/shared/components/icons/layout';
import DriverSelect from '@/shared/components/selectors/DriverSelect';
import DateSelect from '@/shared/components/selectors/DateSelect';

export default function BulkInsightsDashboard() {
  const [loading, setLoading] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [date, setDate] = useState<{ from: Date; to: Date }>({
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

  const { isEditDetails, showDriversFilter } = useVenderStore();


  const BUDDY_QUEUED = 15;
  const currencyCode = 'KWD';

  const updateBulkOrder = (order, action) => {
    setSubmitted(true);
    // Handle dispatch/cancel logic here
    console.log(`${action} order:`, order);
    setTimeout(() => {
      setSubmitted(false);
    }, 1000);
  };

  const editAddress = (order) => {
    console.log('Edit address for order:', order);
  };

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
      const url = orderService.getBulkInsightsUrl(date?.from, date?.to, selectedDriver);
      const res: TypeRootLiveBuilkOrderListInsights =
        await orderService.getOrderList(url);
      if (!res.data) {
        throw new Error(`HTTP error! status: ${res}`);
      }

      setBulkInsightsData(res.data.insights);
      setOrdersList(res.data.orders_list);
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

  const t = useTranslations();

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
          <DateSelect value={date} onChangeAction={setDate}  />
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
        <div className="space-y-4 max-h-[1000px] overflow-y-auto">
          {ordersList.length > 0 ? (
            ordersList.map((order) => (
              <Card key={order.id} className="bg-blue-50/30">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                    {/* Order Info */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg p-3 h-full">
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs text-gray-500">
                              Mashkor Order No
                            </Label>
                            <Badge
                              variant="outline"
                              className="bg-teal-50 text-teal-700 border-teal-200 block mt-1 text-xs"
                            >
                              {order.mashkor_order_number}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">
                              Order No
                            </Label>
                            <p className="text-sm font-medium">
                              {order.order_number}
                            </p>
                          </div>
                          {order.status_change_reason &&
                            order.primary_status === 120 && (
                              <div className="text-center">
                                <p className="text-xs text-red-500 font-semibold">
                                  {order.status_change_reason}
                                </p>
                              </div>
                            )}
                          <div className="text-center mt-3">
                            <Badge
                              variant={getStatusBadgeVariant(
                                order.class_status
                              )}
                              className="text-xs"
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg p-3 h-full space-y-2">
                        <div>
                          <p className="text-xs text-teal-600 font-semibold mb-1">
                            Receiver
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center text-xs">
                              <User className="h-3 w-3 text-teal-500 mr-1" />
                              <span>{order.customer_name}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <Phone className="h-3 w-3 text-teal-500 mr-1" />
                              <span>{order.phone_number}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-teal-600 font-semibold mb-1">
                            Sender
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center text-xs">
                              <User className="h-3 w-3 text-teal-500 mr-1" />
                              <span>{order.customer_name_sender}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <Phone className="h-3 w-3 text-teal-500 mr-1" />
                              <span>{order.phone_number_sender}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Addresses */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg p-3 h-full space-y-2">
                        <div>
                          <p className="text-xs text-teal-600 font-semibold mb-1">
                            From
                          </p>
                          <p className="text-xs text-gray-600">
                            {order.from.slice(0, 50)}
                          </p>
                        </div>
                        <div className="relative">
                          {order.is_delivery_address_edit_enabled && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute -top-1 right-0 h-5 w-5 bg-teal-500 hover:bg-teal-600 border-teal-500"
                              onClick={() => editAddress(order)}
                            >
                              <Edit2 className="h-2 w-2 text-white" />
                            </Button>
                          )}
                          <div className="flex items-start gap-1">
                            <p className="text-xs text-teal-600 font-semibold">
                              To
                            </p>
                            {order.is_addr_last_updated_by_customer && (
                              <CheckCircle className="h-3 w-3 text-teal-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 pr-6">
                            {order.to.slice(0, 50)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Driver Info / Actions */}
                    <div className="lg:col-span-1">
                      {isEditDetails ? (
                        <div className="bg-white rounded-lg p-3 h-full">
                          {order.primary_status === BUDDY_QUEUED ? (
                            <div className="space-y-2">
                              <p className="text-xs text-teal-600">
                                Buddy will pick up your order
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-teal-600 font-semibold">
                                  Driver
                                </p>
                                <p className="text-xs">{order.driver_name}</p>
                              </div>
                              <div className="flex items-center text-xs">
                                <Phone className="h-3 w-3 text-teal-500 mr-1" />
                                <span>{order.driver_phone}</span>
                              </div>
                            </div>
                          )}
                          <div className="flex gap-1 mt-3">
                            <Button
                              size="sm"
                              className="flex-1 text-xs h-8 bg-teal-500 hover:bg-teal-600"
                              onClick={() => updateBulkOrder(order, 'dispatch')}
                              disabled={submitted}
                            >
                              Dispatch
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1 text-xs h-8"
                              onClick={() => updateBulkOrder(order, 'cancel')}
                              disabled={submitted}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg p-3 h-full bg-truck-pattern bg-no-repeat bg-right-top bg-contain">
                          {order.primary_status === BUDDY_QUEUED ? (
                            <div>
                              <p className="text-xs text-teal-600 font-semibold">
                                Buddy will pick up your order
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div>
                                <p className="text-xs text-teal-600 font-semibold">
                                  Driver
                                </p>
                                <p className="text-xs">{order.driver_name}</p>
                              </div>
                              <div className="flex items-center text-xs">
                                <Phone className="h-3 w-3 text-teal-500 mr-1" />
                                <span>{order.driver_phone}</span>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center text-xs mt-2">
                            <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                            <span>
                              {order.delivered_date || order.canceled_at}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Info */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg p-3 h-full space-y-2">
                        <div>
                          <p className="text-xs text-teal-600 font-semibold">
                            Cash on Delivery
                          </p>
                          <p className="text-xs font-medium">
                            {order.amount_collected.toFixed(3)} {currencyCode}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-teal-600 font-semibold">
                            Delivery Fees
                          </p>
                          <p className="text-xs font-medium">
                            {order.delivery_fee.toFixed(3)} {currencyCode}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-teal-600 font-semibold">
                            Payment Method
                          </p>
                          <p className="text-xs">
                            {order.payment_type === 1 ? 'COD' : 'ONLINE'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Distance */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-lg p-3 h-full text-center">
                        <p className="text-xs text-teal-600 font-semibold mb-1">
                          Distance Travelled
                        </p>
                        <p className="text-xs font-medium">
                          {order.delivery_distance.toFixed(1)} KM
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-32 h-32 mx-auto mb-4 opacity-50">
                <img
                  src="/assets/images/nodata.png"
                  alt="No data"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-gray-500">Whoops! No data found</p>
            </div>
          )}
        </div>
      </DashboardContent>
    </Dashboard>
  );
}
