'use client';
import { orderService } from '@/shared/services/orders';
import {
  Clock,
  CreditCard,
  Dot,
  Download,
  Info,
  MapPin,
  Navigation,
  Phone,
  Receipt,
  Search,
  Truck,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import {
  TypeLiveOrderItem,
  TypeRootLiveOrderList,
} from '@/shared/types/orders';
import { useOrderStore } from '@/store/useOrderStore';
import { useSharedStore, useVendorStore } from '@/store';
import { Button } from '@/shared/components/ui/button';
import useTableExport from '@/shared/lib/hooks/useTableExport';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Input } from '@/shared/components/ui/input';
import { useTranslations } from 'next-intl';
import {
  Table,
  TableLists,
  TableSingleListContent,
  TableSingleListContentDetailsItem,
  TableSingleListContentDetailsTitle,
  TableSingleListContents,
  TableSingleListContentTitle,
  TableSingleListHeader,
  TableSingleListHeaderLeft,
  TableSingleListHeaderRight,
  TableSingleList,
} from '@/shared/components/ui/tableList';
import EditResiver from '@/features/orders/components/ui/EditResiver';
import { paymentMap } from '@/features/orders/constants';
import EditPayment from '@/features/orders/components/ui/EditPayment';
import DriverSelect from '@/shared/components/selectors/DriverSelect';
import SearchableSelect from '@/shared/components/selectors';
import DateSelect from '@/shared/components/selectors/DateSelect';
import { DateRange } from 'react-day-picker';
import Rating from '@/features/orders/components/ui/Rating';
import { TableFallback } from '@/shared/components/fetch/fallback';
import AccountManagerSelect from '@/shared/components/selectors/AccountManagerSelect';
import LoadMore from '@/shared/components/fetch/LoadMore';
import NoData from '@/shared/components/fetch/NoData';

export default function OrderTrackingDashboard() {
  const { setSourceForTable, orderHistoryListData } = useOrderStore();
  const { appConstants } = useSharedStore();
  const { isEditDetails, showDriversFilter, vendorId, branchId } =
    useVendorStore();

  const [searchOrder, setSearchOrder] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedAccountManager, setSelectedAccountManager] = useState<
    string | undefined
  >(undefined);
  const [selectedSorting, setSelectedSorting] = useState<string | undefined>(
    undefined
  );
  const [nextSetItemsToken, setNextSetItemsToken] = useState<any>();
  const [data, setData] = useState<TypeLiveOrderItem[]>();

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(10);
  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedDriver, setSelectedDriver] = useState<string>();

  const fetchOrderDetails = useCallback(async () => {
    setNextSetItemsToken(null);
    const searchAll = true;
    const url = orderService.getOrderHistoryUrl(
      page,
      date?.from,
      date?.to,
      searchOrder,
      searchCustomer,
      searchAll,
      null,
      selectedAccountManager,
      selectedDriver,
      selectedSorting
    );

    try {
      // @ts-ignore
      const res: TypeRootLiveOrderList = await orderService.getOrderList(url);

      console.log(url, res);
      if (res.data) {
        setData(res.data);
        setSourceForTable('orderHistoryListData', res.data);
      }

      setIsLoading(false);

      setNextSetItemsToken(res.data.length < page ? null : true);
    } catch (err) {
      const errorMessage =
        err || 'An unknown error occurred while fetching orders.';

      console.log('Error in fetchOrderDetails:', errorMessage);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    date?.from,
    date?.to,
    searchOrder,
    searchCustomer,
    selectedAccountManager,
    selectedDriver,
    selectedSorting,
    vendorId,
    branchId,
  ]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const { exportOrdersToCSV } = useTableExport();

  const t = useTranslations();

  const sortOptions = [
    { id: 'delivery_distance', name: 'Delivery distance ( Z - A )' },
    { id: 'delivery_fee', name: 'Delivery fee ( Z - A )' },
  ];

  if (isLoading) return <TableFallback />;
  return (
    <Dashboard className="h-auto">
      <DashboardHeader>
        <DashboardHeaderRight />

        {/* Search and Filter */}
        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between max-md:flex-wrap">
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

          {isEditDetails && (
            <div className="relative max-sm:w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={'Search Customer ..'}
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                className="pl-10 !border-none !outline-none !ring-0 "
              />
            </div>
          )}

          {showDriversFilter && (
            <DriverSelect
              value={selectedDriver!}
              onChangeAction={setSelectedDriver}
            />
          )}
          {isEditDetails && (
            <AccountManagerSelect
              value={selectedAccountManager}
              onChangeAction={setSelectedAccountManager}
            />
          )}
          {isEditDetails && (
            <SearchableSelect
              options={sortOptions}
              value={selectedSorting}
              onChangeAction={setSelectedSorting}
              placeholder="Sort by..."
              classNameFroInput="border-none"
            />
          )}

          <DateSelect value={date} onChangeAction={setDate} />
          <Button
            onClick={() =>
              exportOrdersToCSV(orderHistoryListData!, 'order history')
            }
            className=" max-sm:w-full"
          >
            <Download className="w-5 h-5" /> Export
          </Button>
        </div>
      </DashboardHeader>
      <DashboardContent>
        {data?.length ? (
          <Table>
            <TableLists>
              {orderHistoryListData!.map((item, idx) => (
                <TableSingleList key={idx}>
                  <TableSingleListHeader className="">
                    <TableSingleListHeaderRight>
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
                    </TableSingleListHeaderRight>
                    <TableSingleListHeaderLeft className="flex items-center gap-2">
                      <Rating order={item} />
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {item.creation_date}
                      </div>
                    </TableSingleListHeaderLeft>
                  </TableSingleListHeader>
                  <TableSingleListContents>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <Receipt size={14} />
                        {t('component.features.orders.live.details.orderNo')}
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.fleetx_order_number}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <User size={14} />{' '}
                        {t('component.features.orders.live.details.sender')}
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.customer_name_sender}
                      </TableSingleListContentDetailsTitle>
                      <TableSingleListContentDetailsItem>
                        <Phone size={12} /> {item.phone_number_sender}
                      </TableSingleListContentDetailsItem>
                      <TableSingleListContentDetailsItem>
                        <MapPin size={12} /> {item.from}
                      </TableSingleListContentDetailsItem>
                    </TableSingleListContent>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <User size={14} />{' '}
                        {t('component.features.orders.live.details.receiver')}
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {item.customer_name}
                      </TableSingleListContentDetailsTitle>
                      <TableSingleListContentDetailsItem>
                        <Phone size={12} /> {item.phone_number}
                      </TableSingleListContentDetailsItem>
                      <TableSingleListContentDetailsItem>
                        <MapPin size={12} /> {item.to}
                      </TableSingleListContentDetailsItem>
                      {item.is_delivery_address_edit_enabled && (
                        <EditResiver
                          data={item}
                          fetchOrderDetails={fetchOrderDetails}
                        />
                      )}
                    </TableSingleListContent>
                    <TableSingleListContent
                      className={!item.driver_name ? 'bg-[#F9F8714D]' : ''}
                    >
                      {item.driver_name ? (
                        <>
                          <TableSingleListContentTitle>
                            <Truck size={14} />{' '}
                            {t(
                              'component.features.orders.live.tracking.driver.defult'
                            )}
                          </TableSingleListContentTitle>
                          <TableSingleListContentDetailsTitle className="text-sm font-medium text-gray-800">
                            {item.driver_name}
                          </TableSingleListContentDetailsTitle>
                          <TableSingleListContentDetailsItem>
                            <Phone size={12} /> {item.driver_phone}
                          </TableSingleListContentDetailsItem>
                          <TableSingleListContentDetailsItem>
                            <Navigation size={12} /> {item.delivery_distance} km
                          </TableSingleListContentDetailsItem>
                        </>
                      ) : (
                        <>
                          <TableSingleListContentTitle className="text-[#915A0B]">
                            <Clock size={14} className="!text-[#915A0B]" />
                            {t(
                              'component.features.orders.live.details.noDriverAssigned'
                            )}
                          </TableSingleListContentTitle>
                          <TableSingleListContentDetailsItem className="">
                            {t(
                              'component.features.orders.live.details.driverQueued'
                            )}
                          </TableSingleListContentDetailsItem>
                        </>
                      )}
                    </TableSingleListContent>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <Info size={14} />{' '}
                        {t(
                          'component.features.orders.live.details.delivery-fee'
                        )}
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {' '}
                        {item.amount_collected} {appConstants?.currency}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <CreditCard size={14} />{' '}
                        {t('component.features.orders.live.details.payment')}
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {paymentMap[item.payment_type] || 'Unknown'}
                      </TableSingleListContentDetailsTitle>
                      {item.is_delivery_address_edit_enabled && (
                        <EditPayment
                          data={item}
                          fetchOrderDetails={fetchOrderDetails}
                        />
                      )}
                    </TableSingleListContent>
                  </TableSingleListContents>
                </TableSingleList>
              ))}
              <LoadMore
                setPage={setPage}
                nextSetItemTotal={nextSetItemsToken!}
                type="table"
              />
            </TableLists>
          </Table>
        ) : (
          <NoData />
        )}
      </DashboardContent>
    </Dashboard>
  );
}
