'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  MapPin,
  User,
  Phone,
  CreditCard,
  Clock,
  Truck,
  Navigation,
  Info,
  Receipt,
  Dot,
} from 'lucide-react';
import { paymentMap } from '@/features/orders/constants';
import { useOrderStore, useSharedStore, useVendorStore } from '@/store';
import EditResiver from '../../ui/EditResiver';
import EditPayment from '../../ui/EditPayment';
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
import { useTranslations } from 'next-intl';

interface OrdersPageProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  nextSetItemTotal: any;
  fetchOrderDetails: () => Promise<void>;
}

export default function TableComponent({
  page,
  setPage,
  nextSetItemTotal,
  fetchOrderDetails,
}: OrdersPageProps) {
  const { appConstants } = useSharedStore();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const orderStore = useOrderStore();
  const { isEditDetails } = useVendorStore();

  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 10); // load 10 more items
  }, [setPage]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [handleLoadMore]);

  const t = useTranslations();
  return (
    <Table>
      <TableLists>
        {orderStore?.orderStatusListData?.map((item, idx) => (
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
              <TableSingleListHeaderLeft className="flex items-center gap-1">
                <Clock size={12} />
                {item.creation_date}
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
                      {t('component.features.orders.live.details.driverQueued')}
                    </TableSingleListContentDetailsItem>
                  </>
                )}
              </TableSingleListContent>
              <TableSingleListContent>
                <TableSingleListContentTitle>
                  <Info size={14} />{' '}
                  {t('component.features.orders.live.details.delivery-fee')}
                </TableSingleListContentTitle>
                <TableSingleListContentDetailsTitle>
                  {' '}
                  {item.amount_collected} {appConstants?.currency}
                </TableSingleListContentDetailsTitle>
              </TableSingleListContent>
              <TableSingleListContent className="h-full">
                <TableSingleListContentTitle>
                  <CreditCard size={14} />{' '}
                  {t('component.features.orders.live.details.payment')}
                </TableSingleListContentTitle>
                <TableSingleListContentDetailsTitle>
                  {paymentMap[item.payment_type] || 'Unknown'}
                </TableSingleListContentDetailsTitle>

                {item.is_delivery_address_edit_enabled &&  (
                  <EditPayment
                    data={item}
                    fetchOrderDetails={fetchOrderDetails}
                  />
                )}
              </TableSingleListContent>
            </TableSingleListContents>
          </TableSingleList>
        ))}
      </TableLists>
    </Table>
  );
}
