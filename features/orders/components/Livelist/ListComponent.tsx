'use client';

import React, { useState } from 'react';
import { MapPin, Clock } from 'lucide-react';
import {
  TypeOrderHistoryList,
  TypeStatusHistoryForUi,
} from '@/shared/types/orders';
import { useOrderStore } from '@/store/useOrderStore';
import { statusColors } from '../../constants';
import OrderTrackingModel from './OrderTrackingModel';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

const ListComponent: React.FC<{
  data: TypeOrderHistoryList[];
  statusHistory: TypeStatusHistoryForUi[];
}> = ({ data, statusHistory }) => {
  const orderStore = useOrderStore();
  const [selectedOrder, setSelectedOrder] =
    useState<TypeOrderHistoryList | null>(null);

  const statusMap: Record<string, string> = {
    'orderStatus.CONFIRMED': 'Confirmed Orders',
    'orderStatus.DRIVER_ASSIGNED': 'Drivers Coming to You',
    'orderStatus.BUDDY_QUEUED': 'Waiting for Pickup',
    'orderStatus.IN_DELIVERY': 'In Delivery',
  };

  const grouped = data.reduce(
    (acc: Record<string, TypeOrderHistoryList[]>, order) => {
      const col = statusMap[order.status] || 'Confirmed Orders';
      if (!acc[col]) acc[col] = [];
      acc[col].push(order);
      return acc;
    },
    {}
  );

  return (
    <>
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 min-h-screen">
        {Object.entries(statusMap).map(([key, label]) => (
          <div
            key={key}
            className="bg-white rounded-lg p-4 shadow-sm flex flex-col"
          >
            <h2 className="text-sm font-semibold">{label}</h2>
            <p className="text-xs text-gray-500 mb-2">
              All your {label.toLowerCase()}
            </p>

            {grouped[label]?.map((order) => (
              <div
                key={order.fleetx_order_number}
                onClick={() => setSelectedOrder(order)}
                className={`rounded-lg border p-3 mb-3 flex justify-between items-start cursor-pointer ${
                  statusColors[order.class_status] ||
                  'bg-gray-100 text-gray-700'
                }`}
                style={{ viewTransitionName: order.fleetx_order_number }}
              >
                {/* Left: Order Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {order.fleetx_order_number}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{order.customer_name}</p>
                  <p className="text-gray-500 text-sm flex items-center mt-6">
                    <MapPin size={16} className="mr-1" />
                    {order.to}
                  </p>
                </div>

                {/* Right: Status & Duration */}
                <div className="flex items-center justify-between text-xs text-gray-500 flex-col h-full ml-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-red-400">
                    {order.class_status}
                  </span>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3" />
                    <span>{order.delivery_duration} Mins</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-semibold">
              Order Tracking – {selectedOrder?.fleetx_order_number}
            </DialogTitle>
            <DialogClose className="absolute top-4 right-4" />
          </DialogHeader>

          {selectedOrder && (
            <OrderTrackingModel
              selectedOrder={selectedOrder}
              statusHistory={statusHistory}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListComponent;
