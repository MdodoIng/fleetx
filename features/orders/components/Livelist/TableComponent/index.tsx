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
  Car,
  CreditCard,
  Clock,
  Star,
  Truck,
  Navigation,
  Info,
  Receipt,
  Edit,
} from 'lucide-react';
import { TypeOrderHistoryList } from '@/shared/types/orders';
import { statusColors, paymentMap } from '@/features/orders/constants';
import Rating from './Rating';
import { useSharedStore } from '@/store';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import EditResiver from './EditResiver';
import EditPayment from './EditPayment';

interface OrdersPageProps {
  data: TypeOrderHistoryList[];
  isRating?: boolean;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  nextSetItemTotal: any;
  fetchOrderDetails: () => Promise<void>;
}

export default function TableComponent({
  data,
  isRating = true,
  page,
  setPage,
  nextSetItemTotal,
  fetchOrderDetails,
}: OrdersPageProps) {
  const [rating, setRating] = useState(0);
  const { appConstants } = useSharedStore();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className="p-6 bg-gray-50 w-full">
      <div className="space-y-6">
        {data.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col border border-gray-100"
          >
            {/* Header Row */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="font-semibold text-gray-700">
                  FleetX #{order.fleetx_order_number}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[order.class_status] ||
                    'bg-gray-100 text-gray-700'
                  }`}
                >
                  {order.class_status}
                </span>
              </div>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500 gap-1.5">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(order.creation_date).toLocaleString()}
                </span>
                {isRating && (
                  <Rating
                    initial={0}
                    order={order}
                    onChange={(value) => console.log('Selected Rating:', value)}
                  />
                )}
              </div>
            </div>

            {/* Order Details */}
            <div className="grid md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] w-full gap-4 text-sm">
              <div className="flex flex-col p-3 rounded-lg border bg-gray-50">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Receipt size={14} /> Order No.
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {order.fleetx_order_number}
                </span>
              </div>

              {/* Sender */}
              <div className="flex flex-col p-3 rounded-lg border bg-gray-50 ">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <User size={14} /> Sender
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {order.customer_name_sender}
                </span>
                <span className="text-xs text-gray-500">
                  📞 {order.phone_number_sender}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} /> {order.from}
                </span>
              </div>

              {/* Receiver */}
              <div className="flex flex-col p-3 rounded-lg border bg-gray-50 relative z-0">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <User size={14} /> Receiver
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {order.customer_name}
                </span>
                <span className="text-xs text-gray-500">
                  📞 {order.phone_number}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} /> {order.to}
                </span>
                <EditResiver
                  data={order}
                  fetchOrderDetails={fetchOrderDetails}
                />
              </div>

              {/* Driver */}
              {order.driver_name ? (
                <div className="flex flex-col p-3 rounded-lg border bg-gray-50 ">
                  <span className="text-xs text-blue-600 flex items-center gap-1">
                    <Truck size={14} /> Driver
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {order.driver_name}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone size={12} /> {order.driver_phone}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Navigation size={12} /> {order.delivery_distance} km
                  </span>
                </div>
              ) : (
                <div className="flex flex-col p-3 rounded-lg border bg-yellow-50 ">
                  <span className="text-xs text-yellow-600 flex items-center gap-1">
                    <Truck size={14} /> No Driver Assigned
                  </span>
                  <span className="text-xs text-gray-600">
                    A driver is queued for pickup, will be assigned shortly
                  </span>
                </div>
              )}

              {/* Delivery Fee */}
              <div className="flex flex-col p-3 rounded-lg border bg-gray-50 ">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Info size={14} /> Delivery Fee
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {' '}
                  {order.amount_collected} {appConstants?.currency}
                </span>
              </div>

              {/* Payment / Fee */}
              <div className="border rounded p-3 relative z-0">
                <h3 className="font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <CreditCard size={14} /> Payment
                </h3>
                <p>
                  {paymentMap[order.payment_type] || 'Unknown'} <br />
                  <span className="text-gray-500">
                    Fee: {order.delivery_fee} KD
                  </span>
                </p>
                {parseFloat(order.amount_to_collect) > 0 && (
                  <p className="text-gray-500">
                    Collect: {order.amount_to_collect} KD
                  </p>
                )}
                <EditPayment
                  data={order}
                  fetchOrderDetails={fetchOrderDetails}
                />
              </div>
            </div>

            {/* Footer */}
          </div>
        ))}
      </div>

      {/* Pagination */}

      <div
        hidden={nextSetItemTotal === null}
        className="flex justify-center mt-6 gap-2 bg-white w-full shadow rounded-md py-3"
      >
        <div
          ref={loadMoreRef}
          className="flex justify-center items-center py-4 text-gray-500"
        >
          Loading more...
        </div>
      </div>
    </div>
  );
}
