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
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

const ListComponent: React.FC<{
  statusHistory: TypeStatusHistoryForUi[];
}> = ({ statusHistory }) => {
  const orderStore = useOrderStore();
  const [selectedOrder, setSelectedOrder] =
    useState<TypeOrderHistoryList | null>(null);

  const data = orderStore?.orderStatusListData;

  const t = useTranslations('component.features.orders.live');
  const tD = useTranslations();

  const statusMap: Record<string, { title: string; subtitle: string }> = {
    'orderStatus.CONFIRMED': {
      title: t('status-map.CONFIRMED.title'),
      subtitle: t('status-map.CONFIRMED.subtitle'),
    },

    'orderStatus.DRIVER_ASSIGNED': {
      title: t('status-map.DRIVER_ASSIGNED.title'),
      subtitle: t('status-map.DRIVER_ASSIGNED.subtitle'),
    },
    'orderStatus.BUDDY_QUEUED': {
      title: t('status-map.BUDDY_QUEUED.title'),
      subtitle: t('status-map.BUDDY_QUEUED.subtitle'),
    },
    'orderStatus.IN_DELIVERY': {
      title: t('status-map.IN_DELIVERY.title'),
      subtitle: t('status-map.IN_DELIVERY.subtitle'),
    },
  };

  const grouped = data?.reduce(
    (acc: Record<string, TypeOrderHistoryList[]>, order) => {
      const key =
        Object.keys(statusMap).find(
          (key) => statusMap[key].title === order.status
        ) || 'orderStatus.CONFIRMED';
      if (key) {
        if (!acc[key]) acc[key] = [];
        acc[key].push(order);
      }
      return acc;
    },
    {}
  );

  console.log(grouped);

  return (
    <>
      <div className="grid grid-cols-4 gap-4 min-h-screen w-full">
        {Object.entries(statusMap).map(([key, label]) => (
          <Card key={key} className="bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {label.title}
              </CardTitle>
              <CardDescription> {label.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="flex h-[calc(100vh-40px)] w-full overflow-y-auto flex-col gap-4">
              {grouped?.[key]?.map((order) => (
                <div
                  key={order.id}
                  style={{
                    viewTransitionName: order.fleetx_order_number,
                    border: `1px solid ${selectedOrder?.id === order.id ? '#004CF7' : '#2828281A'}`,
                  }}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 flex justify-between transition-colors rounded-[8px] flex-col ${
                    selectedOrder?.id === order.id
                      ? 'bg-[#004CF70D] text-primary-blue'
                      : 'bg-white text-dark-grey'
                  }`}
                >
                  <div className="flex w-full justify-between gap-1 items-start ">
                    <div className="flex flex-col">
                      <span className="font-medium opacity-70 text-sm">
                        {order.fleetx_order_number}
                      </span>
                      <p className="font-medium text-lg">
                        {order.customer_name}
                      </p>
                    </div>
                    <div className="flex flex-col items-end text-xs">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-white bg-red-400',
                          order.class_status
                        )}
                      >
                        {tD(order.status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full justify-between gap-1 items-start mt-4 ">
                    <p className="text-sm flex items-center  overflow-hidden">
                      <MapPin size={16} />
                      {order.to.substring(0, 20) +
                        (order.to.length > 30 ? '...' : '')}
                      
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>
                        {Number(order.delivery_duration) - 4} -{' '}
                        {Number(order.delivery_duration) + 4} {t('mins')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-[90vw] max-h-[90vh] sm:max-w-max overflow-y-auto p-0">
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
