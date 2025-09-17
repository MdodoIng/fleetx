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
    Phone, CreditCard,
    Clock, Truck,
    Navigation,
    Info,
    Receipt, Dot
} from 'lucide-react';
import { TypeOrderHistoryList } from '@/shared/types/orders';
import { paymentMap } from '@/features/orders/constants';
import { useOrderStore, useSharedStore } from '@/store';
import EditResiver from './EditResiver';
import EditPayment from './EditPayment';
import {
    Table,
    TableLists,
    TableSigleList,
    TableSigleListContent,
    TableSigleListContents,
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
  const [rating, setRating] = useState(0);
  const { appConstants } = useSharedStore();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const orderStore = useOrderStore();
  const handleClick = (value: number) => {
    setRating(value);
  };

  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 10); // load 10 more items
  }, []);

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
        {orderStore?.orderStatusListData!.map((item, idx) => (
          <TableSigleList key={idx}>
            <TableSigleListHeader className="">
              <TableSigleListHeaderRight>
                <span className="font-semibold text-primary-blue">
                  FleetX #{item.fleetx_order_number}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Receipt size={14} /> Order No.
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {item.fleetx_order_number}
                </span>
              </TableSigleListContent>
              <TableSigleListContent>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <User size={14} /> Sender
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {item.customer_name_sender}
                </span>
                <span className="text-xs text-gray-500">
                  <Phone size={12} /> {item.phone_number_sender}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} /> {item.from}
                </span>
              </TableSigleListContent>
              <TableSigleListContent>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <User size={14} /> Receiver
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {item.customer_name}
                </span>
                <span className="text-xs text-gray-500">
                  <Phone size={12} /> {item.phone_number}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} /> {item.to}
                </span>
                <EditResiver
                  data={item}
                  fetchOrderDetails={fetchOrderDetails}
                />
              </TableSigleListContent>
              <TableSigleListContent>
                {item.driver_name ? (
                  <>
                    <span className="text-xs text-blue-600 flex items-center gap-1">
                      <Truck size={14} /> Driver
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {item.driver_name}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Phone size={12} /> {item.driver_phone}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Navigation size={12} /> {item.delivery_distance} km
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-yellow-600 flex items-center gap-1">
                      <Truck size={14} /> No Driver Assigned
                    </span>
                    <span className="text-xs text-gray-600">
                      A driver is queued for pickup, will be assigned shortly
                    </span>
                  </>
                )}
              </TableSigleListContent>
              <TableSigleListContent>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Info size={14} /> Delivery Fee
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {' '}
                  {item.amount_collected} {appConstants?.currency}
                </span>
              </TableSigleListContent>
              <TableSigleListContent>
                <h3 className="font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <CreditCard size={14} /> Payment
                </h3>
                <p>
                  {paymentMap[item.payment_type] || 'Unknown'} <br />
                  <span className="text-gray-500">
                    Fee: {item.delivery_fee} KD
                  </span>
                </p>
                {parseFloat(item.amount_to_collect) > 0 && (
                  <p className="text-gray-500">
                    Collect: {item.amount_to_collect} KD
                  </p>
                )}
                <EditPayment
                  data={item}
                  fetchOrderDetails={fetchOrderDetails}
                />
              </TableSigleListContent>
            </TableSigleListContents>
          </TableSigleList>
        ))}
      </TableLists>
    </Table>
  );
}
