'use client';
import { orderService } from '@/shared/services/orders';
import { CalendarIcon, Download, Grid, List, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';

import GridComponent from '@/features/orders/components/Livelist/GridComponent';
import ListComponent from '@/features/orders/components/Livelist/ListComponent';
import { useOrderStatusHistory } from '@/features/orders/hooks/useOrderStatusHistory';
import {
  TypeOrderHistoryList,
  TypeOrderStatusHistoryHistory,
} from '@/shared/types/orders';
import { useOrderStore } from '@/store/useOrderStore';
import { useAuthStore } from '@/store';
import TableComponent from '@/features/orders/components/Livelist/TableComponent/index';
import { Button } from '@/shared/components/ui/button';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { cn } from '@/shared/lib/utils';
import LoadingPage from '../../loading';

export default function OrderTrackingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  const [ordernNumber, setOrdernNumber] = useState('');
  const orderStore = useOrderStore();
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
  const [date, setDate] = useState<{ from: Date; to: Date }>();

  const fetchOrderDetails = async (perPage: number) => {
    setIsLoading(true);
    useOrderStore.setState({
      orderHistoryListData: undefined,
    });

    const searchAll = isEditDetails ? null : true;

    const url = orderService.getOrderHistoryUrl(
      10,
      date?.from,
      date?.to,
      ordernNumber,
      searchCustomer,
      searchDriver,
      searchAll
    );

    try {
      const res = await orderService.getOrderList(url);

      if (res.data) {
        orderStore.setSourceForTable('orderHistoryListData', res.data);
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

      console.log('Error in fetchOrderDetails:', errorMessage);
    }
  };

  useEffect(() => {
    const loadInitialOrders = async () => {
      await fetchOrderDetails(20);
    };

    loadInitialOrders();
  }, []);

  const { exportOrdersToCSV } = useTableExport();

  if (isLoading || !orderStore.orderHistoryListData) return <LoadingPage />;

  console.log(orderStore.orderHistoryListData, 'weew');

  return (
    <div className="flex bg-gray-50 flex-col items-center overflow-hidden">
      {/* Left Panel - Orders List */}

      <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
        <div className="flex items-center justify-between ">
          <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
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
                  // @ts-ignore
                  onSelect={setDate}
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

          <Button
            onClick={() => exportOrdersToCSV(orderStore.orderHistoryListData!)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Download className="w-5 h-5" /> Export
          </Button>
        </div>
      </div>

      {orderStore?.orderHistoryListData.length ? (
        <TableComponent data={orderStore?.orderHistoryListData!} />
      ) : (
        <>no data</>
      )}
    </div>
  );
}
