'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { withAuth } from '@/shared/components/Layout/ProtectedLayout/withAuth';
import { useAuthStore, useSharedStore } from '@/store';
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

// Interface for the fleet service response to correctly type driver data
interface FleetServiceResponse {
  data: Driver[];
}

// Updated DateRange to allow `from` and `to` to be optional, matching react-day-picker's DateRange type
interface DateRange {
  from?: Date;
  to?: Date;
}

// Default data
const defaultDashboardData: DashboardData = {
  total_delivery_fees: 0,
  total_cash_collected: 0,
  total_failed_orders: 0,
  delivery_models: { on_demand: 0, grouped: 0, bulk: 0 },
  payment_methods: { cod: 0, online: 0 },
};

function Dashboard() {
  const { user } = useAuthStore();
  const { appConstants } = useSharedStore();

  // Consolidated state management
  const [dashboardData, setDashboardData] =
    useState<DashboardData>(defaultDashboardData);
  const [driverList, setDriverList] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [driverName, setDriverName] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [isDriversLoading, setIsDriversLoading] = useState(false);

  // Date range state - simplified to single source of truth
  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  });

  // Destructure dashboard data with fallback
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
      ].includes(role)
    ) ?? false;

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    // Ensure both dates are present before fetching, as per current logic
    if (!date.from || !date.to) {
      // Potentially reset dashboard data or show a message if dates are incomplete
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
      // Cast the result to the defined interface to resolve 'unknown' type error
      const driverResult = (await fleetService.getDriver()) as FleetServiceResponse;

      if (driverResult.data) {
        setDriverList(driverResult.data);
        setFilteredDrivers(driverResult.data);
      }
    } catch (error: any) {
      console.error('Error fetching driver data:', error);
      setDriverList([]);
      setFilteredDrivers([]);
    } finally {
      setIsDriversLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [date, selectedDriverId]);

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
  const currencyCode = appConstants?.currency || 'USD';

  // Dynamic styles based on data
  const cardClasses = {
    deliveryFee: totalToPay > 0 ? 'blockRed' : 'blockGreen',
    cashCollected: totalToPay > 0 ? 'blockGreen' : 'blockRed',
    totalToPay: totalToPay > 0 ? 'blockGreen' : 'blockRed',
  };

  const cardImages = {
    deliveryFee:
      totalToPay > 0
        ? '/assets/images/delivery_red.png'
        : '/assets/images/delivery_green.png',
    cashCollected:
      totalToPay > 0
        ? '/assets/images/cash_collected_green.png'
        : '/assets/images/cash_collected_red.png',
    totalToPay:
      totalToPay > 0
        ? '/assets/images/price_green.svg'
        : '/assets/images/price_red.svg',
  };

  // Event handlers
  const handleDateApply = () => {
    fetchDashboardData();
  };

  const handleDriverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDriverName(value);

    if (!value) {
      setSelectedDriverId(null);
      setFilteredDrivers(driverList);
      return;
    }

    const filtered = driverList.filter((driver) =>
      driver.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDrivers(filtered);

    // Auto-select if exact match
    const exactMatch = filtered.find(
      (driver) => driver.name.toLowerCase() === value.toLowerCase()
    );
    if (exactMatch) {
      setSelectedDriverId(exactMatch.fleet_id);
    } else {
      setSelectedDriverId(null);
    }
  };

  const handleClearDriverFilter = () => {
    setDriverName('');
    setSelectedDriverId(null);
    setFilteredDrivers(driverList);
  };

  // Adjusted handleDateSelect to correctly accept the DateRange from react-day-picker
  const handleDateSelect = (newDate: DateRange | undefined) => {
    if (newDate) {
      setDate(newDate);
    } else {
      // If newDate is undefined (e.g., cleared selection), reset the date range
      setDate({ from: undefined, to: undefined });
    }
  };

  return (
    <div className="lockcardPage">
      <div className="cardBlocks">
        <div className="row">
          <div className="col-md-7" style={{ marginLeft: '-5px' }}>
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
                    selected={date}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                className="text-primary"
                onClick={handleDateApply}
                disabled={isDashboardLoading}
              >
                {isDashboardLoading ? 'Loading...' : 'Apply'}
              </Button>
            </div>
          </div>

          <div className="col-md-5">
            {hasDriverAccess && (
              <>
                <div className="customInputGroup">
                  <label className="customInputLabel">Driver</label>
                  <input
                    type="text"
                    placeholder={
                      isDriversLoading ? 'Loading drivers...' : 'Select Driver'
                    }
                    value={driverName}
                    onChange={handleDriverChange}
                    disabled={isDriversLoading}
                    list="drivers"
                  />
                  {/*<datalist id="drivers">
                    {(filteredDrivers || []).map((driver) => (
                      <option key={driver.fleet_id} value={driver.name} />
                    ))}
                  </datalist>*/}
                </div>
                <button
                  type="button"
                  onClick={handleClearDriverFilter}
                  className="tileRedBtn"
                  disabled={
                    isDriversLoading || (!driverName && !selectedDriverId)
                  }
                >
                  Clear Filter
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row">
        <div className="col-md-3">
          <div className={`BlocksCard ${cardClasses.deliveryFee}`}>
            <div className="row">
              <span className="Shape">
                <Image
                  src={cardImages.deliveryFee}
                  alt="Delivery Fees"
                  width={40}
                  height={40}
                />
              </span>
              <div className="paymentdata">
                <h5>Total Delivery Fees</h5>
                <h2>
                  <span>{totalDeliveryFees}</span> {currencyCode}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className={`BlocksCard ${cardClasses.cashCollected}`}>
            <div className="row">
              <span className="Shape">
                <Image
                  src={cardImages.cashCollected}
                  alt="Cash Collected"
                  width={40}
                  height={40}
                />
              </span>
              <div className="paymentdata">
                <h5>Total cash collected</h5>
                <h2>
                  <span>{totalCashCollected}</span> {currencyCode}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className={`BlocksCard ${cardClasses.totalToPay}`}>
            <div className="row">
              <span className="Shape">
                <Image
                  src={cardImages.totalToPay}
                  alt="Total to Pay"
                  width={40}
                  height={40}
                />
              </span>
              <div className="paymentdata">
                <h5>{totalToPayText}</h5>
                <h2>
                  <span>{totalToPayDisplay}</span> {currencyCode}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="BlocksCard blockOrange">
            <div className="row">
              <span className="Shape">
                <Image
                  src="/assets/images/failed_orders.svg"
                  alt="Failed Orders"
                  width={40}
                  height={40}
                />
              </span>
              <div className="paymentdata">
                <h5>Total failed orders</h5>
                <h2>
                  <span>{totalFailedOrders}</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Blocks */}
      <div className="row">
        <div className="col-md-6">
          <div className="paymentBlock">
            <h3>
              <span>
                <Image
                  src="/assets/images/payment_ico.svg"
                  alt="Payment"
                  width={20}
                  height={20}
                />
              </span>
              Payment methods
            </h3>
            <div className="barLine">
              <label>COD</label>
              <span>{cod}</span>
              <div className="bar">
                <div
                  className="barColor"
                  style={{
                    width: `${totalPaymentMethod !== 0 ? (cod * 100) / totalPaymentMethod : 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="barLine">
              <label>ONLINE</label>
              <span>{online}</span>
              <div className="bar">
                <div
                  className="barColor"
                  style={{
                    width: `${totalPaymentMethod !== 0 ? (online * 100) / totalPaymentMethod : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="paymentBlock">
            <h3>
              <span>
                <Image
                  src="/assets/images/delivery_ico.svg"
                  alt="Delivery"
                  width={20}
                  height={20}
                />
              </span>
              Delivery models{' '}
              <span className="totalpaybtn">Total : {totalDeliveryModels}</span>
            </h3>
            <div className="barLine">
              <label>On-demand</label>
              <span>{on_demand}</span>
              <div className="bar">
                <div
                  className="barColor"
                  style={{
                    width: `${totalDeliveryModels !== 0 ? (on_demand * 100) / totalDeliveryModels : 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="barLine">
              <label>Grouped</label>
              <span>{grouped}</span>
              <div className="bar">
                <div
                  className="barColor"
                  style={{
                    width: `${totalDeliveryModels !== 0 ? (grouped * 100) / totalDeliveryModels : 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="barLine">
              <label>Bulk</label>
              <span>{bulk}</span>
              <div className="bar">
                <div
                  className="barColor"
                  style={{
                    width: `${totalDeliveryModels !== 0 ? (bulk * 100) / totalDeliveryModels : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard, [
  'VENDOR_USER',
  'FINANCE_MANAGER',
  'OPERATION_MANAGER',
  'VENDOR_ACCOUNT_MANAGER',
  'SALES_HEAD',
]);
