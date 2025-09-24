'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';

import { useOrderStore, useSharedStore, useVendorStore } from '@/store';
import { cn } from '@/shared/lib/utils';
import { reportService } from '@/shared/services/report';
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
import DateSelect from '@/shared/components/selectors/DateSelect';
import { DateRange } from 'react-day-picker';
import { DashboardFallback } from '@/shared/components/fallback';

const defaultDashboardData: TypeDashboardDetailsResponse['data'] = {
  total_delivery_fees: 0,
  total_cash_collected: 0,
  total_failed_orders: 0,
  delivery_models: { on_demand: 0, grouped: 0, bulk: 0 },
  payment_methods: { cod: 0, online: 0 },
};

function DashboardCompoent() {
  const { appConstants } = useSharedStore();
  const { showDriversFilter } = useVendorStore();
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] =
    useState<TypeDashboardDetailsResponse['data']>(defaultDashboardData);

  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const [selectedDriver, setSelectedDriver] = useState<string | undefined>();

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
        searchDriver: selectedDriver!,
      });

      const dashboardResult =
        await reportService.getDashboardDetails(dashboardUrl);

      if (dashboardResult.data) {
        console.log(dashboardResult, 'dashboardResult');
        setDashboardData(dashboardResult.data);
      }
    } catch (error: unknown) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(defaultDashboardData);
    }
  }, [date, selectedDriver]);

  useEffect(() => {
    const fetc = async () => {
      await fetchDashboardData();
      setLoading(false);
    };
    fetc();
  }, [fetchDashboardData]);

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

  if (loading) return <DashboardFallback />;

  return (
    <Dashboard className="h-auto sm:h-full">
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
          className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]
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
