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
import { useAuthStore, useVenderStore } from '@/store';
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
import { reportService } from '@/shared/services/report';
import { TypeWalletTransactionHistoryRes } from '@/shared/types/report';
import TableComponent from '@/features/wallet/components/history/TableComponent';
import { set } from 'zod/v3';

export default function OrderTrackingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  const [ordernNumber, setOrdernNumber] = useState('');
  const orderStore = useOrderStore();

  const [isEditDetails, setIsEditDetails] = useState(false);

  const [searchOrder, setSearchOrder] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchDriver, setSearchDriver] = useState('');

  const [selectedSorting, setSelectedSorting] = useState<string | undefined>(
    undefined
  );

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState(null);

  const [date, setDate] = useState<{ from: Date; to: Date }>();

  const [walletHistory, setWalletHistory] =
    useState<TypeWalletTransactionHistoryRes['data']>();
  const venderStore = useVenderStore();

  const fetchVendorWalletBalance = async () => {
    setIsLoading(true);
    try {
      if (venderStore.vendorId) {
        const walletHistoryUrl = reportService.getWalletHistoryUrl(
          page,
          searchOrder,
          date?.from!,
          date?.to!,
          nextSetItemTotal
        );
        const walletHistoryRes =
          await reportService.getWalletHistory(walletHistoryUrl);

        setWalletHistory(walletHistoryRes.data!);
      } else {
        console.warn(
          'vendorId or branchId is null. Cannot fetch wallet balance.'
        );
      }
    } catch (err: any) {
      const errorMessage =
        err.error?.message ||
        err.message ||
        'An unknown error occurred while fetching wallet balance.';
      console.error('Error in fetchVendorWalletBalance:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialWalletBalance = async () => {
      await fetchVendorWalletBalance();
    };
    loadInitialWalletBalance();
  }, [venderStore.vendorId, venderStore.branchId, page, date?.from, date?.to]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'dd MMM yyyy, hh:mm a');
  };

  const { exportOrdersToCSV } = useTableExport();

  console.log(walletHistory, 'weew');

  return (
    <div className="flex bg-gray-50 flex-col items-center overflow-hidden">
      {/* Left Panel - Orders List */}

      <div className="flex items-center justify-between w-[calc(100%-16px)] bg-gray-200 px-3 py-3 mx-2 my-2 rounded">
        <div className="flex items-center justify-between ">
          <h2 className="text-xl font-semibold text-gray-900">
            Wallet History
          </h2>
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
            onClick={() =>
              exportOrdersToCSV(
                walletHistory!,
                'wallet history',
                `wallet history ${date?.from ? format(date.from, 'yyyy-MM-dd') : ''} - ${
                  date?.to ? format(date.to, 'yyyy-MM-dd') : ''
                }`
              )
            }
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Download className="w-5 h-5" /> Export
          </Button>
        </div>
      </div>

      {walletHistory?.length ? (
        <TableComponent data={walletHistory!} page={page} setPage={setPage} />
      ) : (
        <>no data</>
      )}
    </div>
  );
}
