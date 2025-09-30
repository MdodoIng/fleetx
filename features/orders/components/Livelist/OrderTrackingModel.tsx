'use client';

import { MapPin, Phone, LocateFixed, ShipWheel } from 'lucide-react';
import {
  TypeOrderHistoryList,
  TypeStatusHistoryForUi,
} from '@/shared/types/orders';
import MyMap from '@/shared/components/MyMap/Map';
import { paymentMap } from '../../constants';
import StatusStep from './StatusStep';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { useTranslations } from 'next-intl';
import { useSharedStore } from '@/store';

export default function OrderTrackingModel({
  selectedOrder,
  statusHistory,
}: {
  selectedOrder: TypeOrderHistoryList;
  statusHistory: TypeStatusHistoryForUi[];
}) {
  
  const t = useTranslations()
  const { appConstants} = useSharedStore()
  
  if (!selectedOrder) return null;

  return (
    <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4">
      {/* Center Panel - Live Tracking Map */}
      <div className="col-span-6 flex flex-col h-full overflow-y-auto">
        <div className="p-6 bg-white border-b border-gray-200 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900">Live Tracking</h3>
          <p className="text-sm text-gray-600 mt-1">
            Live location updates right here
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 w-full max-w-md space-y-4 mt-3">
          <div className="text-gray-700 font-semibold">
            {selectedOrder.fleetx_order_number}
          </div>

          {/* Pickup */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl text-green-300 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-300" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {selectedOrder.customer_name_sender}
              </div>
              <div className="text-sm text-gray-500">{selectedOrder.from}</div>
            </div>
            <button className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
              <Phone className="w-4 h-4" /> {selectedOrder.phone_number_sender}
            </button>
          </div>

          {/* Drop-off */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <LocateFixed className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {selectedOrder.customer_name}
              </div>
              <div className="text-sm text-gray-500">{selectedOrder.to}</div>
            </div>
            <button className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
              <Phone className="w-4 h-4" /> {selectedOrder.phone_number}
            </button>
          </div>

          {/* Driver */}
          <hr />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
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

        {/* Map */}
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
      </div>

      {/* Right Panel - Timeline */}
      <Card className="col-span-6  w-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {t('component.features.orders.live.tracking.title')}
          </CardTitle>
          <CardDescription>{t('component.features.orders.live.tracking.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="flex  flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="grid gap-1">
              <p className="text-lg font-semibold">
                {selectedOrder.customer_name}
              </p>
              <p className="text-sm text-[#1D1B20]/70">
                {t('component.features.orders.live.details.payment-method')}
              </p>
              <p className="text-sm text-[#1D1B20]/70">
                {t('component.features.orders.live.details.delivery-fee')}
              </p>
            </div>
            <div className="text-right grid gap-1">
              <p className="text-lg font-semibold">
                {selectedOrder.fleetx_order_number}
              </p>
              <p className="text-sm text-[#1D1B20]/70">
                {paymentMap[selectedOrder.payment_type]}
              </p>
              <p className="text-sm text-[#1D1B20]/70">
                {selectedOrder.delivery_fee} {appConstants?.currency}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-4 space-y-5">
            {statusHistory.map((status, idx) => (
              <StatusStep key={idx} status={status} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
