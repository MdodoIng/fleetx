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
import EditResiver from './EditResiver';
import EditPayment from './EditPayment';
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
          <TableSigleList key={idx}>
            <TableSigleListHeader className="">
              <TableSigleListHeaderRight>
                <span className="font-semibold text-primary-blue flex">
                  <p className="ltr:hidden">FleetX #</p>{' '}
                  {item.fleetx_order_number}{' '}
                  <p className="rtl:hidden"># FleetX</p>
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${item.class_status
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
                      {t('component.features.orders.live.details.driverQueued')}
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
  );
}
