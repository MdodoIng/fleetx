'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';

import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import {
  useAuthStore,
  useOrderStore,
  useSharedStore,
  useVenderStore,
} from '@/store';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardIcon,
  CardTitle,
} from '@/shared/components/ui/card';
import { TypeDashboardDetailsResponse } from '@/shared/types/report';
import {
  DashboardHeader,
  DashboardHeaderRight,
  Dashboard,
  DashboardContent,
} from '@/shared/components/ui/dashboard';
import { useTranslations } from 'next-intl';
import { ActiveOrdersIcon } from '@/shared/components/icons/layout';
import { Separator } from '@/shared/components/ui/separator';
import DriverSelect from '@/shared/components/selectors/DriverSelect';

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

function DashboardCompoent() {
  const { appConstants, readAppConstants } = useSharedStore();
  const { driverId, setValue } = useOrderStore();
  const { showDriversFilter } = useVenderStore();

  const [dashboardData, setDashboardData] =
    useState<TypeDashboardDetailsResponse['data']>(defaultDashboardData);
  const [driverList, setDriverList] =
    useState<TypeFleetDriverResponse['data']>();

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

  const fetchDashboardData = useCallback(async () => {
    if (!date.from || !date.to) {
      return;
    }
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
    }
  }, [date.from, date.to]);

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
    fetchDashboardData();
  }, [date, fetchDashboardData, driverId]);

  useEffect(() => {
    fetchDriverData();
  }, [fetchDriverData]);

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

  const statisticsCards = Object.entries({
    TotalDeliveryFees: {
      value: totalDeliveryFees,
      currency: currencyCode,
      label: 'Total Delivery Fees',
      icon: ActiveOrdersIcon,
      className: cardClasses.deliveryFee,
    },
    TotalCashCollected: {
      value: totalCashCollected,
      currency: currencyCode,
      label: 'Total cash collected',
      icon: ActiveOrdersIcon,
      className: cardClasses.cashCollected,
    },
    TotalToPay: {
      value: totalToPayDisplay,
      currency: currencyCode,
      label: totalToPayText,
      icon: ActiveOrdersIcon,
      className: cardClasses.totalToPay,
    },
    TotalFailedOrders: {
      value: totalFailedOrders,
      label: 'Total failed orders',
      icon: ActiveOrdersIcon,
      className: 'bg-orange-100',
    },
  });

  const analyticsBlocks = Object.entries({
    'Payment methods': {
      icon: ActiveOrdersIcon,
      items: {
        COD: { value: cod, color: 'bg-blue-500' },
        ONLINE: { value: online, color: 'bg-green-500' },
      },
      total: totalPaymentMethod,
    },
    'Delivery models': {
      icon: ActiveOrdersIcon,
      items: {
        'On-demand': { value: on_demand, color: 'bg-red-500' },
        Grouped: { value: grouped, color: 'bg-yellow-500' },
        Bulk: { value: bulk, color: 'bg-purple-500' },
      },
      total: totalDeliveryModels,
    },
  });

  const t = useTranslations();

  return (
    <Dashboard className="h-auto sm:h-full">
      <DashboardHeader>
        <DashboardHeaderRight />
        {/* Search and Filter */}
        <div className="flex sm:justify-center gap-1.5 max-sm:w-full justify-between">
          {showDriversFilter && <DriverSelect />}
          <div className="flex items-center gap-2 relative z-0 bg-white rounded-[8px] max-sm:w-full">
            <Popover>
              <PopoverTrigger
                asChild
                className="!ring-0 border-none text-dark-grey max-sm:w-full shrink"
              >
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(' justify-start text-left font-normal')}
                >
                  <CalendarIcon className=" h-4 w-4" />
                  {date?.from ? (
                    date?.to ? (
                      <>
                        {format(date.from, 'PP')} - {format(date.to, 'PP')}
                      </>
                    ) : (
                      format(date.from, 'PPP')
                    )
                  ) : (
                    <span>
                      {t('component.features.orders.history.search.dateRange')}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 flex">
                <Calendar
                  autoFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              className={cn(
                date?.to
                  ? 'text-primary-blue cursor-pointer'
                  : 'pointer-events-none'
              )}
              onClick={() => console.log('Apply with:', date)}
            >
              Apply
            </Button>
          </div>
        </div>
      </DashboardHeader>

      {/* Statistics Cards */}
      <DashboardContent className="flex w-full flex-col items-center justify-start">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 w-full">
          {statisticsCards.map(([key, item]) => (
            <Card key={key} className="py-4">
              <CardContent className="gap-6 flex flex-col px-4">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className={cn('text-sm opacity-70')}>
                    {item.label}
                  </CardTitle>
                  <CardIcon>
                    <item.icon className="!text-dark-grey" />
                  </CardIcon>
                </div>
                <CardContent className="px-0">
                  <CardDescription className={cn('text-2xl font-medium')}>
                    {item.value} {item.currency}
                  </CardDescription>
                </CardContent>
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
            <Card key={title} className="py-4">
              <CardContent className="gap-6 flex flex-col px-4">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className={cn('text-sm opacity-70')}>
                    {title}
                  </CardTitle>
                  <CardIcon>
                    <data.icon className="!text-dark-grey" />
                  </CardIcon>
                </div>
                <div className="flex flex-col gap-3">
                  {Object.entries(data.items).map(([label, item]) => (
                    <div
                      className="flex justify-between items-center"
                      key={label}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${item.color}`}
                        ></div>
                        <span className="text-sm font-medium text-gray-600">
                          {label}
                        </span>
                      </div>
                      <span className="text-sm font-bold">{item.value}</span>
                    </div>
                  ))}
                  {title === 'Delivery models' && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Total
                        </span>
                        <span className="text-sm font-bold">{data.total}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardContent>
    </Dashboard>
  );
}

export default DashboardCompoent;
