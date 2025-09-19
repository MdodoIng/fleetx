'use client';
import { orderService } from '@/shared/services/orders';
import {
  CalendarIcon,
  Clock,
  CreditCard,
  Dot,
  Download,
  Info,
  ListFilter,
  MapPin,
  Navigation,
  Phone,
  Receipt,
  Search,
  Truck,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { TypeOrderHistoryList } from '@/shared/types/orders';
import { useOrderStore } from '@/store/useOrderStore';
import { useSharedStore, useVenderStore } from '@/store';
import { Button } from '@/shared/components/ui/button';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { cn } from '@/shared/lib/utils';
import {
  Dashboard,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useTranslations } from 'next-intl';
import {
  Table,
  TableLists,
  TableSigleList,
  TableSigleListContent,
  TableSigleListContentDetailsItem,
  TableSigleListContentDetailsTitle,
  TableSigleListContents,
  TableSigleListContentTitle,
  TableSigleListHeader,
  TableSigleListHeaderLeft,
  TableSigleListHeaderRight,
} from '@/shared/components/ui/tableList';
import EditResiver from '@/features/orders/components/Livelist/TableComponent/EditResiver';
import { paymentMap } from '@/features/orders/constants';
import EditPayment from '@/features/orders/components/Livelist/TableComponent/EditPayment';

export default function OrderTrackingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Orders');
  const [ordernNumber, setOrdernNumber] = useState('');
  const orderStore = useOrderStore();
  const { appConstants } = useSharedStore();
  const { isEditDetails } = useVenderStore();

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
  const [nextSetItemsToken, setNextSetItemsToken] = useState<any>();

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(10);
  const [date, setDate] = useState<{ from: Date; to: Date }>();

  const fetchOrderDetails = useCallback(async () => {
    setIsLoading(true);

    const searchAll = true;

    const url = orderService.getOrderHistoryUrl(
      page,
      date?.from,
      date?.to,
      ordernNumber,
      searchCustomer,
      searchAll
    );

    try {
      const res = await orderService.getOrderList(url);

      if (res.data) {
        orderStore.setSourceForTable('orderHistoryListData', res.data);
      }
      setNextSetItemsToken(res.count! < page ? null : true);
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
  }, [
    date?.from,
    date?.to,
    orderStore,
    ordernNumber,
    page,
    searchCustomer,
    searchDriver,
  ]);

  useEffect(() => {
    const loadInitialOrders = async () => {
      await fetchOrderDetails();
    };

    loadInitialOrders();
  }, [fetchOrderDetails]);

  const { exportOrdersToCSV } = useTableExport();

  const t = useTranslations();

  return (
    <Dashboard className="h-auto">
      <DashboardHeader>
        <DashboardHeaderRight />

        {/* Search and Filter */}
        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between max-sm:flex-wrap">
          <div className="relative max-sm:w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={t('component.features.orders.live.search.default')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0 "
            />
          </div>

          <div className="flex items-center justify-center gap-1.5  max-sm:w-full">
            <Select
              value={selectedFilter}
              onValueChange={(value) => setSelectedFilter(value)}
            >
              <SelectTrigger className="sm:w-[180px]  max-sm:w-full bg-white border-none relative pl-10">
                <ListFilter className="absolute left-3" />
                <SelectValue
                  placeholder={t(
                    'component.features.orders.history.search.allOrder'
                  )}
                  className="text-dark-grey"
                >
                  {selectedFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">
                  {t('component.features.orders.history.search.allOrder')}
                </SelectItem>
                <SelectItem value="active">
                  {t('component.features.orders.history.search.active')}
                </SelectItem>
                <SelectItem value="confirmed">
                  {t('component.features.orders.history.search.confirmed')}
                </SelectItem>
                <SelectItem value="urgent">
                  {t('component.features.orders.history.search.urgent')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

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
          <Button
            onClick={() =>
              exportOrdersToCSV(
                orderStore.orderHistoryListData!,
                'order history'
              )
            }
            className=" max-sm:w-full"
          >
            <Download className="w-5 h-5" /> Export
          </Button>
        </div>
      </DashboardHeader>

      {orderStore?.orderHistoryListData?.length ? (
        <Table>
          <TableLists>
            {orderStore?.orderHistoryListData!.map((item, idx) => (
              <TableSigleList key={idx}>
                <TableSigleListHeader className="">
                  <TableSigleListHeaderRight>
                    <span className="font-semibold text-primary-blue flex">
                      <p className="ltr:hidden">FleetX #</p>{' '}
                      {item.fleetx_order_number}{' '}
                      <p className="rtl:hidden"># FleetX</p>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        item.class_status
                      }`}
                    >
                      {t(item.status)}
                    </span>
                    <span
                      className={`text-xs text-primary-teal flex items-center `}
                    >
                      <Dot />
                      {item.branch_name}
                    </span>
                  </TableSigleListHeaderRight>
                  <TableSigleListHeaderLeft className="flex items-center gap-1">
                    <Clock size={12} />
                    {item.creation_date}
                  </TableSigleListHeaderLeft>
                </TableSigleListHeader>
                <TableSigleListContents>
                  <TableSigleListContent>
                    <TableSigleListContentTitle>
                      <Receipt size={14} />
                      {t('component.features.orders.live.details.orderNo')}
                    </TableSigleListContentTitle>
                    <TableSigleListContentDetailsTitle>
                      {item.fleetx_order_number}
                    </TableSigleListContentDetailsTitle>
                  </TableSigleListContent>
                  <TableSigleListContent>
                    <TableSigleListContentTitle>
                      <User size={14} />{' '}
                      {t('component.features.orders.live.details.sender')}
                    </TableSigleListContentTitle>
                    <TableSigleListContentDetailsTitle>
                      {item.customer_name_sender}
                    </TableSigleListContentDetailsTitle>
                    <TableSigleListContentDetailsItem>
                      <Phone size={12} /> {item.phone_number_sender}
                    </TableSigleListContentDetailsItem>
                    <TableSigleListContentDetailsItem>
                      <MapPin size={12} /> {item.from}
                    </TableSigleListContentDetailsItem>
                  </TableSigleListContent>
                  <TableSigleListContent>
                    <TableSigleListContentTitle>
                      <User size={14} />{' '}
                      {t('component.features.orders.live.details.receiver')}
                    </TableSigleListContentTitle>
                    <TableSigleListContentDetailsTitle>
                      {item.customer_name}
                    </TableSigleListContentDetailsTitle>
                    <TableSigleListContentDetailsItem>
                      <Phone size={12} /> {item.phone_number}
                    </TableSigleListContentDetailsItem>
                    <TableSigleListContentDetailsItem>
                      <MapPin size={12} /> {item.to}
                    </TableSigleListContentDetailsItem>
                    {isEditDetails && (
                      <EditResiver
                        data={item}
                        fetchOrderDetails={fetchOrderDetails}
                      />
                    )}
                  </TableSigleListContent>
                  <TableSigleListContent
                    className={!item.driver_name ? 'bg-[#F9F8714D]' : ''}
                  >
                    {item.driver_name ? (
                      <>
                        <TableSigleListContentTitle>
                          <Truck size={14} />{' '}
                          {t(
                            'component.features.orders.live.tracking.driver.defult'
                          )}
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsTitle className="text-sm font-medium text-gray-800">
                          {item.driver_name}
                        </TableSigleListContentDetailsTitle>
                        <TableSigleListContentDetailsItem>
                          <Phone size={12} /> {item.driver_phone}
                        </TableSigleListContentDetailsItem>
                        <TableSigleListContentDetailsItem>
                          <Navigation size={12} /> {item.delivery_distance} km
                        </TableSigleListContentDetailsItem>
                      </>
                    ) : (
                      <>
                        <TableSigleListContentTitle className="text-[#915A0B]">
                          <Clock size={14} className="!text-[#915A0B]" />
                          {t(
                            'component.features.orders.live.details.noDriverAssigned'
                          )}
                        </TableSigleListContentTitle>
                        <TableSigleListContentDetailsItem className="">
                          {t(
                            'component.features.orders.live.details.driverQueued'
                          )}
                        </TableSigleListContentDetailsItem>
                      </>
                    )}
                  </TableSigleListContent>
                  <TableSigleListContent>
                    <TableSigleListContentTitle>
                      <Info size={14} />{' '}
                      {t('component.features.orders.live.details.delivery-fee')}
                    </TableSigleListContentTitle>
                    <TableSigleListContentDetailsTitle>
                      {' '}
                      {item.amount_collected} {appConstants?.currency}
                    </TableSigleListContentDetailsTitle>
                  </TableSigleListContent>
                  <TableSigleListContent>
                    <TableSigleListContentTitle>
                      <CreditCard size={14} />{' '}
                      {t('component.features.orders.live.details.payment')}
                    </TableSigleListContentTitle>
                    <TableSigleListContentDetailsTitle>
                      {paymentMap[item.payment_type] || 'Unknown'}
                    </TableSigleListContentDetailsTitle>
                    {isEditDetails && (
                      <EditPayment
                        data={item}
                        fetchOrderDetails={fetchOrderDetails}
                      />
                    )}
                  </TableSigleListContent>
                </TableSigleListContents>
              </TableSigleList>
            ))}
          </TableLists>
        </Table>
      ) : (
        <>no data</>
      )}
    </Dashboard>
  );
}
