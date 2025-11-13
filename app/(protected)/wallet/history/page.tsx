'use client';
import { format } from 'date-fns';
import {
  Clock,
  CreditCard,
  DollarSign,
  Dot,
  Info,
  MapPin,
  Navigation,
  Phone,
  Search,
  Truck,
  User,
  User2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { paymentMap } from '@/features/orders/constants';
import Export from '@/shared/components/Export';
import { TableFallback } from '@/shared/components/fetch/fallback';
import LoadMore from '@/shared/components/fetch/LoadMore';
import NoData from '@/shared/components/fetch/NoData';
import DateSelect from '@/shared/components/selectors/DateSelect';
import {
  Dashboard,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Input } from '@/shared/components/ui/input';
import {
  Table,
  TableLists,
  TableSingleList,
  TableSingleListContent,
  TableSingleListContentDetailsItem,
  TableSingleListContentDetailsTitle,
  TableSingleListContents,
  TableSingleListContentTitle,
  TableSingleListHeader,
  TableSingleListHeaderLeft,
  TableSingleListHeaderRight,
} from '@/shared/components/ui/tableList';
import { orderService } from '@/shared/services/orders';
import { reportService } from '@/shared/services/report';
import { vendorService } from '@/shared/services/vendor';
import { OperationType, TypeOrderHistoryList } from '@/shared/types/orders';
import { TypeWalletTransactionHistoryRes } from '@/shared/types/report';
import { TypeBranch } from '@/shared/types/vendor';
import { useOrderStore, useSharedStore, useVendorStore } from '@/store';
import { useTranslations } from 'next-intl';
import { DateRange } from 'react-day-picker';

export default function OrderTrackingDashboard() {
  const { setSourceForTable } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');

  const { appConstants } = useSharedStore();

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(10);
  const [nextSetItemTotal, setNextSetItemTotal] = useState<boolean | null>(
    null
  );

  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  const [walletHistory, setWalletHistory] = useState<
    (TypeWalletTransactionHistoryRes['data'][number] & {
      branch: TypeBranch | undefined;
      order: TypeOrderHistoryList | undefined;
    })[]
  >();
  const { branchId, vendorId } = useVendorStore();

  const fetchVendorWalletReport = useCallback(async () => {
    try {
      // 1️⃣ Build wallet history API URL
      const walletHistoryUrl = reportService.getWalletHistoryUrl(
        page,
        searchTerm,
        date.from!,
        date.to!,
        null
      );

      // 2️⃣ Fetch wallet history
      const walletHistoryRes =
        await reportService.getWalletHistory(walletHistoryUrl);
      const walletHistoryItems = walletHistoryRes?.data ?? [];

      // 3️⃣ Fetch branch + order details for each wallet record in parallel
      const walletHistoryData = await Promise.all(
        walletHistoryItems.map(async (item) => {
          try {
            //   Fetch branch details for vendor/branch
            const branchList = await vendorService.getBranchDetails(
              item.vendor_id
            );
            const branchRes = branchList.data.find(
              (x) => x.id === item.branch_id
            );

            //   Fetch order details if delivery_model exists
            let orderRes = null;
            if (item.delivery_model) {
              const url = orderService.getOrderHistoryUrl(
                1,
                undefined,
                undefined,
                item.txn_number,
                undefined,
                true,
                null,
                undefined,
                undefined,
                undefined
              );
              const orderListRes = await orderService.getOrderList(url);
              orderRes =
                setSourceForTable(
                  'orderHistoryListData',
                  orderListRes.data as any
                )[0] ?? undefined;
            }

            return {
              ...item,
              branch: branchRes,
              order: orderRes,
            };
          } catch (innerErr) {
            console.warn('Error while mapping wallet record:', innerErr);
            return { ...item, branch: null, order: null };
          }
        })
      );

      // 4️⃣ Update state
      setWalletHistory(walletHistoryData as any);
      setNextSetItemTotal(walletHistoryData.length < page ? null : true);
    } catch (err: unknown) {
      const errorMessage =
        (err as { error?: { message?: string }; message?: string }).error
          ?.message ||
        (err as { message?: string }).message ||
        'An unknown error occurred while fetching wallet balance.';
      console.error('❌ Error in fetchVendorWalletReport:', errorMessage);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm, date?.from, date?.to, branchId, vendorId]);

  useEffect(() => {
    fetchVendorWalletReport();
  }, [fetchVendorWalletReport]);

  const t = useTranslations();

  if (isLoading) return <TableFallback />;

  return (
    <Dashboard className="">
      <DashboardHeader>
        <DashboardHeaderRight />

        {/* Search and Filter */}
        <div className="flex sm:justify-center gap-2 max-sm:w-full justify-between max-sm:flex-wrap">
          <div className="relative max-sm:w-full ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={t('component.features.orders.live.search.default')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 !border-none !outline-none !ring-0 "
            />
          </div>

          <DateSelect value={date} onChangeAction={setDate} />

          <Export
            data={walletHistory!}
            title="wallet history"
            exclude={[
              'branch-vendor-is_vendor_central_wallet_enabled',
              'order-isSyncShow',
              'order-isOlderData',
            ]}
          />
        </div>
      </DashboardHeader>

      {walletHistory?.length ? (
        <Table>
          <TableLists>
            {walletHistory.map((txn, idx) => {
              const isCredit = Number(txn.txn_amount) > 0;

              const operation_type = OperationType.find(
                (x) => x.key === txn?.operation_type
              );

              return (
                <TableSingleList key={idx}>
                  <TableSingleListHeader className="">
                    <TableSingleListHeaderRight>
                      <span className="font-semibold text-primary-blue flex">
                        {txn.txn_number}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-medium ${operation_type?.color}`}
                      >
                        {operation_type?.value}
                      </span>
                      {txn.branch && (
                        <span className="text-xs text-primary-teal flex items-center">
                          <Dot />
                          {txn.branch.name}
                        </span>
                      )}
                    </TableSingleListHeaderRight>
                    <TableSingleListHeaderLeft className="flex items-center gap-1">
                      <Clock size={12} />
                      {format(new Date(txn.txn_at), 'PPp')}
                    </TableSingleListHeaderLeft>
                  </TableSingleListHeader>
                  <TableSingleListContents>
                    <TableSingleListContent hidden={!!txn?.order}>
                      <TableSingleListContentTitle>
                        <User2 size={14} />
                        {t('component.features.wallet.user')}
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {txn.branch?.vendor.name}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>

                    {txn?.order && (
                      <>
                        <TableSingleListContent>
                          <TableSingleListContentTitle>
                            <User size={14} />{' '}
                            {t('component.features.orders.live.details.sender')}
                          </TableSingleListContentTitle>
                          <TableSingleListContentDetailsTitle>
                            {txn.order.customer_name_sender}
                          </TableSingleListContentDetailsTitle>
                          <TableSingleListContentDetailsItem>
                            <Phone size={12} />{' '}
                            {txn.order.pick_up.mobile_number}
                          </TableSingleListContentDetailsItem>
                          <TableSingleListContentDetailsItem>
                            <MapPin size={12} /> {txn.order.from}
                          </TableSingleListContentDetailsItem>
                        </TableSingleListContent>
                        <TableSingleListContent>
                          <TableSingleListContentTitle>
                            <User size={14} />{' '}
                            {t(
                              'component.features.orders.live.details.receiver'
                            )}
                          </TableSingleListContentTitle>
                          <TableSingleListContentDetailsTitle>
                            {txn.order.customer_name}
                          </TableSingleListContentDetailsTitle>
                          <TableSingleListContentDetailsItem>
                            <Phone size={12} />{' '}
                            {txn.order.drop_off.mobile_number}
                          </TableSingleListContentDetailsItem>
                          <TableSingleListContentDetailsItem>
                            <MapPin size={12} /> {txn.order.to}
                          </TableSingleListContentDetailsItem>
                        </TableSingleListContent>
                        <TableSingleListContent
                          className={
                            !txn.order.driver_name ? 'bg-[#F9F8714D]' : ''
                          }
                        >
                          {txn.order.driver_name ? (
                            <>
                              <TableSingleListContentTitle>
                                <Truck size={14} />{' '}
                                {t(
                                  'component.features.orders.live.tracking.driver.defult'
                                )}
                              </TableSingleListContentTitle>
                              <TableSingleListContentDetailsTitle className="text-sm font-medium text-gray-800">
                                {txn.order.driver_name}
                              </TableSingleListContentDetailsTitle>
                              <TableSingleListContentDetailsItem>
                                <Phone size={12} /> {txn.order.driver_phone}
                              </TableSingleListContentDetailsItem>
                              <TableSingleListContentDetailsItem>
                                <Navigation size={12} />{' '}
                                {txn.order.delivery_distance} km
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
                            {txn.order.amount_collected}{' '}
                            {appConstants?.currency}
                          </TableSingleListContentDetailsTitle>
                        </TableSingleListContent>
                        <TableSingleListContent>
                          <TableSingleListContentTitle>
                            <CreditCard size={14} />{' '}
                            {t(
                              'component.features.orders.live.details.payment'
                            )}
                          </TableSingleListContentTitle>
                          <TableSingleListContentDetailsTitle>
                            {paymentMap[txn.order.payment_type] || 'Unknown'}
                          </TableSingleListContentDetailsTitle>
                        </TableSingleListContent>
                      </>
                    )}
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <DollarSign size={14} />
                        {t(
                          'component.features.orders.create.form.amount.default'
                        )}
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle
                        className={`${operation_type?.color.replaceAll('bg', 'text')}`}
                      >
                        {isCredit ? '+' : ''}
                        {txn.txn_amount} {appConstants?.currency}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>
                    <TableSingleListContent>
                      <TableSingleListContentTitle>
                        <CreditCard size={14} />
                        {t('component.features.wallet.balence')}
                      </TableSingleListContentTitle>
                      <TableSingleListContentDetailsTitle>
                        {txn.balance.balance_amount} {appConstants?.currency}
                      </TableSingleListContentDetailsTitle>
                    </TableSingleListContent>
                  </TableSingleListContents>
                </TableSingleList>
              );
            })}
            <LoadMore
              setPage={setPage}
              nextSetItemTotal={nextSetItemTotal}
              type="table"
            />
          </TableLists>
        </Table>
      ) : (
        <NoData />
      )}
    </Dashboard>
  );
}
