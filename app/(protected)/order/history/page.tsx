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
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import DriverSelect from '@/shared/components/selectors/DriverSelect';
import SortSelect from '@/shared/components/selectors';
import SearchableSelect from '@/shared/components/selectors';
import DateSelect from '@/shared/components/selectors/DateSelect';

export default function OrderTrackingDashboard() {
  const orderStore = useOrderStore();
  const { appConstants } = useSharedStore();
  const { isEditDetails, showDriversFilter } = useVenderStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchOrder, setSearchOrder] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
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
  const [selectedDriver, setSelectedDriver] = useState<string>();

  const url = useMemo(() => {
    const searchAll = true;
    return orderService.getOrderHistoryUrl(
      page,
      date?.from,
      date?.to,
      searchOrder,
      searchCustomer,
      searchAll,
      nextSetItemsToken,
      selectedAccountManager,
      selectedDriver,
      selectedSorting
    );
  }, [
    date?.from,
    date?.to,
    nextSetItemsToken,
    page,
    searchCustomer,
    searchOrder,
    selectedAccountManager,
    selectedDriver,
    selectedSorting,
  ]);

  const fetchOrderDetails = useCallback(async () => {
    setIsLoading(true);

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
  }, [page, url]);

  useEffect(() => {
    fetchOrderDetails();
    console.log(url);
  }, [fetchOrderDetails, url]);

  const { exportOrdersToCSV } = useTableExport();

  const t = useTranslations();

  const sortOptions = [
    { id: 'delivery_distance', name: 'Delivery distance ( Z - A )' },
    { id: 'delivery_fee', name: 'Delivery fee ( Z - A )' },
  ];
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
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0 "
            />
          </div>

          {showDriversFilter && (
            <DriverSelect
              value={selectedDriver!}
              onChangeAction={setSelectedDriver}
            />
          )}
          {isEditDetails && (
            <SearchableSelect
              options={sortOptions}
              value={selectedSorting}
              onChangeAction={setSelectedSorting}
              placeholder="Sort by..."
              classNameFroInput='border-none'
            />
          )}

          <DateSelect value={date} onChangeAction={setDate}  />
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
