'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { useAuthStore, useOrderStore, useSharedStore } from '@/store';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { reportService } from '@/shared/services/report';
import { fleetService } from '@/shared/services/fleet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Card, CardContent } from '@/shared/components/ui/card';
import { TypeDashboardDetailsResponse } from '@/shared/types/report';

// Type definitions
interface DashboardData {
  total_delivery_fees: number;
  total_cash_collected: number;
  total_failed_orders: number;
  delivery_models: {
    on_demand: number;
    grouped: number;
    bulk: number;
  };
  payment_methods: {
    cod: number;
    online: number;
  };
}

interface Driver {
  fleet_id: string;
  name: string;
}

// Updated DateRange to allow `from` and `to` to be optional, matching react-day-picker's DateRange type
interface DateRange {
  from?: Date;
  to?: Date;
}

const defaultDashboardData: TypeDashboardDetailsResponse['data'] = {
  total_delivery_fees: 0,
  total_cash_collected: 0,
  total_failed_orders: 0,
  delivery_models: { on_demand: 0, grouped: 0, bulk: 0 },
  payment_methods: { cod: 0, online: 0 },
};

function Dashboard() {
  const { user } = useAuthStore();
  const { appConstants, readAppConstants } = useSharedStore();
  const { driverId, setValue } = useOrderStore();

  // Consolidated state management
  const [dashboardData, setDashboardData] =
    useState<TypeDashboardDetailsResponse['data']>(defaultDashboardData);
  const [driverList, setDriverList] =
    useState<TypeFleetDriverResponse['data']>();

  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [isDriversLoading, setIsDriversLoading] = useState(false);

  // Date range state - simplified to single source of truth
  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  });

  const {
    total_delivery_fees: totalDeliveryFees = 0,
    total_cash_collected: totalCashCollected = 0,
    total_failed_orders: totalFailedOrders = 0,
    delivery_models: { on_demand = 0, grouped = 0, bulk = 0 } = {},
    payment_methods: { cod = 0, online = 0 } = {},
  } = dashboardData;

  // Check if user has driver access permissions
  const hasDriverAccess =
    user?.roles?.some((role) =>
      [
        'OPERATION_MANAGER',
        'FINANCE_MANAGER',
        'VENDOR_ACCOUNT_MANAGER',
        'SALES_HEAD',
      ].includes(role as any)
    ) ?? false;

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!date.from || !date.to) {
      return;
    }

    setIsDashboardLoading(true);
    try {
      const dashboardUrl = reportService.getDashboardUrl({
        selectedFromDate: date.from,
        selectedToDate: date.to,
      });

      const dashboardResult =
        await reportService.getDashboardDetails(dashboardUrl);

      if (dashboardResult.data) {
        console.log(dashboardResult, 'dashboardResult');
        setDashboardData(dashboardResult.data);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(defaultDashboardData);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  // Fetch driver data
  const fetchDriverData = async () => {
    if (!hasDriverAccess) return;

    setIsDriversLoading(true);
    try {
      const driverResult = await fleetService.getDriver();

      if (driverResult.data) {
        setDriverList(driverResult.data);
      }
    } catch (error: any) {
      console.error('Error fetching driver data:', error);
      setDriverList(undefined);
    } finally {
      setIsDriversLoading(false);
    }
  };

  useEffect(() => {
    readAppConstants();
    fetchDashboardData();
  }, [date, driverId]);

  useEffect(() => {
    fetchDriverData();
  }, [hasDriverAccess]);

  const totalToPay = parseFloat(
    (totalCashCollected - totalDeliveryFees).toFixed(2)
  );
  const totalToPayDisplay = Math.abs(totalToPay);
  const totalDeliveryModels = on_demand + grouped + bulk;
  const totalPaymentMethod = cod + online;

  const totalToPayText = totalToPay < 0 ? 'TOTAL TO COLLECT' : 'TOTAL TO PAY';
  const currencyCode = appConstants?.currency;

  const cardClasses = {
    deliveryFee: totalToPay > 0 ? 'bg-red-100' : 'bg-green-100',
    cashCollected: totalToPay > 0 ? 'bg-green-100' : 'bg-red-100',
    totalToPay: totalToPay > 0 ? 'bg-green-100' : 'bg-red-100',
  };

  const cardImages = {
    deliveryFee:
      totalToPay > 0
        ? '/images/delivery_red.png'
        : '/images/delivery_green.png',
    cashCollected:
      totalToPay > 0
        ? '/images/cash_collected_green.png'
        : '/images/cash_collected_red.png',
    totalToPay:
      totalToPay > 0 ? '/images/price_green.svg' : '/images/price_red.svg',
  };

  const handleDateSelect = (newDate: DateRange | undefined) => {
    if (newDate) {
      setDate(newDate);
    } else {
      setDate({ from: undefined, to: undefined });
    }
  };

  const statisticsCards = Object.entries({
    TotalDeliveryFees: {
      value: totalDeliveryFees,
      currency: currencyCode,
      label: 'Total Delivery Fees',
      image: cardImages.deliveryFee,
      className: cardClasses.deliveryFee,
    },
    TotalCashCollected: {
      value: totalCashCollected,
      currency: currencyCode,
      label: 'Total cash collected',
      image: cardImages.cashCollected,
      className: cardClasses.cashCollected,
    },
    TotalToPay: {
      value: totalToPayDisplay,
      currency: currencyCode,
      label: totalToPayText,
      image: cardImages.totalToPay,
      className: cardClasses.totalToPay,
    },
    TotalFailedOrders: {
      value: totalFailedOrders,
      label: 'Total failed orders',
      image: '/images/failed_orders.svg',
      className: 'bg-orange-100',
    },
  });

  const analyticsBlocks = Object.entries({
    'Payment methods': {
      image: '/images/payment_ico.svg',
      items: {
        COD: { value: cod, color: 'bg-blue-500' },
        ONLINE: { value: online, color: 'bg-green-500' },
      },
      total: totalPaymentMethod,
    },
    'Delivery models': {
      image: '/images/delivery_ico.svg',
      items: {
        'On-demand': { value: on_demand, color: 'bg-red-500' },
        Grouped: { value: grouped, color: 'bg-yellow-500' },
        Bulk: { value: bulk, color: 'bg-purple-500' },
      },
      total: totalDeliveryModels,
    },
  });

  return (
    <div className="flex bg-gray-50 flex-col items-center overflow-hidden">
      {/* Left Panel - Orders List */}

      <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'w-[280px] justify-start text-left font-normal',
                  !date?.from && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date?.to ? (
                    <>
                      From {format(date.from, 'PP')} - To{' '}
                      {format(date.to, 'PP')}
                    </>
                  ) : (
                    format(date.from, 'PPP')
                  )
                ) : (
                  <span>From Date - To Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 flex">
              <Calendar
                autoFocus
                mode="range"
                defaultMonth={date?.from}
                // @ts-ignore
                selected={date}
                onSelect={handleDateSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            className="text-primary"
            onClick={() => console.log('Apply with:', date)}
          >
            Apply
          </Button>
        </div>

        {/* Search and Filter */}
        <div
          hidden={!hasDriverAccess}
          className="flex items-center justify-center gap-1.5"
        >
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

      {/* Statistics Cards */}
      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] p-2
        w-full gap-5"
      >
        {statisticsCards.map(([key, item]) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center justify-center h-12 w-12 rounded-full ${
                    item.className === 'blockRed'
                      ? 'bg-red-100'
                      : item.className === 'blockGreen'
                        ? 'bg-green-100'
                        : item.className
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.label}
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold">
                    {item.value} {item.currency}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Blocks */}
      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] p-2
      w-full gap-5"
      >
        {analyticsBlocks.map(([title, data]) => (
          <Card key={title} className="col-md-6">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                <span className="mr-1">
                  <Image src={data.image} alt={title} width={20} height={20} />
                </span>
                {title}{' '}
                {title === 'Delivery models' && (
                  <span className="text-sm font-medium text-gray-600">
                    Total : {data.total}
                  </span>
                )}
              </h3>
              {Object.entries(data.items).map(([label, item]) => (
                <div
                  className="flex items-center justify-between mb-1"
                  key={label}
                >
                  <label className="text-sm font-medium text-gray-600">
                    {label}
                  </label>
                  <span className="text-sm">{item.value}</span>
                  <div className="w-1/2 bg-gray-200 rounded-full h-2">
                    <div
                      className={`rounded-full h-2 ${item.color}`}
                      style={{
                        width: `${
                          data.total !== 0 ? (item.value * 100) / data.total : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
