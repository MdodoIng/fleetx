'use client';

import React from 'react';
import { MapPin, Clock, Phone, LocateFixed, ShipWheel } from 'lucide-react';
import {
  TypeOrderHistoryList,
  TypeStatusHistoryForUi,
} from '@/shared/types/orders';
import MyMap from '@/shared/components/MyMap/Map';
import { paymentMap } from '../../constants';

interface GridComponentProps {
  orders: TypeOrderHistoryList[];
  selectedOrder: TypeOrderHistoryList | null;
  setSelectedOrder: React.Dispatch<React.SetStateAction<TypeOrderHistoryList>>;
  statusHistory: TypeStatusHistoryForUi[];
}

const GridComponent: React.FC<GridComponentProps> = ({
  orders,
  selectedOrder,
  setSelectedOrder,
  statusHistory,
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 h-screen bg-gray-50 p-4">
      {/* Left Panel - Orders List */}
      <div className="col-span-3 flex flex-col bg-white rounded-xl shadow-sm">
        {/* Orders Header */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Orders</h3>
          <p className="text-xs text-gray-500 mt-1">
            Find a live or an active orders
          </p>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto">
          {orders?.map((order) => (
            <div
              key={order.id}
              style={{
                viewTransitionName: order.fleetx_order_number,
              }}
              onClick={() => setSelectedOrder(order)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 flex items-start justify-between transition-colors ${
                selectedOrder?.id === order.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-500'
                  : ''
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {order.fleetx_order_number}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{order.customer_name}</p>
                <p className="text-gray-500 text-sm flex items-center mt-6">
                  <MapPin size={16} />
                  {order.to}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 flex-col h-full">
                <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-red-400 ml-auto">
                  {order.class_status}
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{order.delivery_duration} Mins</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel - Live Tracking Map */}
      <div className="col-span-6 flex flex-col h-full overflow-y-auto">
        {/* Map Header */}
        <div className="p-6 bg-white border-b border-gray-200 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900">Live Tracking</h3>
          <p className="text-sm text-gray-600 mt-1">
            Live location updates right here
          </p>
        </div>

        {selectedOrder && (
          <>
            <div className="bg-white rounded-2xl shadow p-4 w-full max-w-md space-y-4 mt-3">
              {/* Order ID */}
              <div className="text-gray-700 font-semibold">
                {selectedOrder.fleetx_order_number}
              </div>

              {/* Pickup Location */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl text-green-300 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-300" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {selectedOrder.customer_name_sender}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedOrder.from}
                  </div>
                </div>
                <button className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
                  <Phone className="w-4 h-4" />{' '}
                  {selectedOrder.phone_number_sender}
                </button>
              </div>

              {/* Drop-off Location */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <LocateFixed className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {selectedOrder.customer_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedOrder.to}
                  </div>
                </div>
                <button className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
                  <Phone className="w-4 h-4" /> {selectedOrder.phone_number}
                </button>
              </div>

              <hr />

              {/* Driver Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <ShipWheel className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Driver</div>
                    <div className="font-medium text-gray-900">
                      {selectedOrder.driver_name}
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-600 rounded-lg font-medium">
                  <Phone className="w-4 h-4" /> Call Driver
                </button>
              </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative bg-gray-100 mt-3 rounded-md shadow">
              <MyMap
                center={[
                  {
                    lat: Number(selectedOrder?.pick_up?.latitude) || 0,
                    lng: Number(selectedOrder?.pick_up?.longitude) || 0,
                  },
                  {
                    lat: Number(selectedOrder?.drop_off?.latitude) || 0,
                    lng: Number(selectedOrder?.drop_off?.longitude) || 0,
                  },
                ]}
              />
            </div>
          </>
        )}
      </div>

      {/* Right Panel - Order Details */}
      <div className="col-span-3 bg-white rounded-xl shadow-sm p-4">
        {selectedOrder && (
          <>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500">Order Details</p>
                <p className="text-lg font-semibold">
                  {selectedOrder.customer_name}
                </p>
                <p className="text-xs text-gray-500">
                  {paymentMap[selectedOrder.payment_type]}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {selectedOrder.fleetx_order_number}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedOrder.delivery_fee} KD
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-4 space-y-5">
              {statusHistory
                .filter((s) => s.display)
                .map((status) => (
                  <div key={status.id} className="flex gap-3 items-start">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 rounded-full ${
                          status.completed
                            ? 'bg-purple-600'
                            : 'border border-gray-300'
                        }`}
                      />
                      <div className="h-6 w-px bg-gray-200" />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          status.completed ? 'text-purple-600' : 'text-gray-500'
                        }`}
                      >
                        {status.text}
                      </p>
                      {status.time && (
                        <p className="text-xs text-gray-400">
                          {new Date(status.time).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GridComponent;
