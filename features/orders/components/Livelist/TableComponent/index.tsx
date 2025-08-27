'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { TypeOrderHistoryList } from '@/shared/types/orders';
import { statusColors, paymentMap } from '@/features/orders/constants';
import Rating from './Rating';
import { useSharedStore } from '@/store';

interface OrdersPageProps {
  data: TypeOrderHistoryList[];
  isRating?: boolean;
}

export default function TableComponent({
  data,
  isRating = true,
}: OrdersPageProps) {
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState(0);
  const { appConstants } = useSharedStore();

  const handleClick = (value: number) => {
    setRating(value);
  };
  const pageSize = 5;

  const paginated = data?.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6 bg-gray-50">
      <div className="space-y-6">
        {paginated.map((order) => (
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
              <div className="flex flex-col p-3 rounded-lg border bg-gray-50 ">
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
              <div className="border rounded p-3">
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
              </div>
            </div>

            {/* Footer */}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2 bg-white w-full shadow rounded-md py-3">
        {Array.from({ length: Math.ceil(data.length / pageSize) }).map(
          (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                page === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}
