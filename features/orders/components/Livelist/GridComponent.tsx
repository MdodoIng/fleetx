'use client';

import React, { Fragment, useState } from 'react';
import { MapPin, Clock, Phone, ShipWheel, LucideProps } from 'lucide-react';
import {
  TypeOrderHistoryList,
  TypeStatusHistoryForUi,
} from '@/shared/types/orders';
import MyMap from '@/shared/components/MyMap/Map';
import { paymentMap } from '../../constants';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/shared/components/ui/card';
import { useTranslations } from 'next-intl';
import { useOrderStore, useSharedStore } from '@/store';
import { cn } from '@/shared/lib/utils';
import StatusStep from './StatusStep';
import useMediaQuery from '@/shared/lib/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/components/ui/dialog';

interface GridComponentProps {
  selectedOrder: TypeOrderHistoryList | null;
  setSelectedOrder: React.Dispatch<React.SetStateAction<TypeOrderHistoryList>>;
  statusHistory: TypeStatusHistoryForUi[];
  isModel?: boolean;
}

const GridComponent: React.FC<GridComponentProps> = ({
  selectedOrder,
  setSelectedOrder,
  statusHistory,
  isModel: toggleModel = false,
}) => {
  const { orderStatusListData } = useOrderStore();
  const t = useTranslations('component.features.orders.live');
  const tD = useTranslations();
  const { appConstants } = useSharedStore();
  const isMobile = useMediaQuery('lg');
  const [isModel, setIsModel] = useState(toggleModel);

  const trackingData: {
    name: string;
    type?: 'driver';
    location?: string;
    cta: {
      label: string;
      link: string;
    };
    icon: {
      icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
      >;
      color: string;
    };
  }[] = [
    {
      name: selectedOrder?.customer_name_sender || '',
      location: selectedOrder?.from || '',
      cta: {
        label: selectedOrder?.phone_number_sender,
        link: `tel:${selectedOrder?.phone_number_sender}`,
      },
      icon: {
        icon: MapPin,
        color: '217, 119, 6',
      },
    },
    {
      name: selectedOrder?.customer_name || '',
      location: selectedOrder?.to || '',
      cta: {
        label: selectedOrder?.phone_number,
        link: `tel:${selectedOrder?.phone_number}`,
      },
      icon: {
        icon: ShipWheel,
        color: '72, 182, 79',
      },
    },
    {
      name: selectedOrder?.driver_name || '',
      type: 'driver',
      cta: {
        label: t('tracking.driver.call'),
        link: `tel:${selectedOrder?.driver_phone}`,
      },
      icon: {
        icon: ShipWheel,
        color: '0, 76, 247',
      },
    },
  ];

  const Componet = () => (
    <div className="grid gap-4 grid-cols-12 w-full">
      <Card
        hidden={isModel}
        className="lg:col-span-3 col-span-12 flex flex-col w-full lg:max-h-[calc(100vh-80px)] overflow-hidden "
      >
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {t('order.title')}
          </CardTitle>
          <CardDescription>{t('order.subtitle')}</CardDescription>
        </CardHeader>

        <CardContent className="flex w-full overflow-y-auto hide-scrollbar snap-mandatory flex-col gap-4">
          {orderStatusListData?.map((order) => (
            <div
              key={order.id}
              style={{
                viewTransitionName: order.fleetx_order_number,
                border: `1px solid ${selectedOrder?.id === order.id ? '#004CF7' : '#2828281A'}`,
              }}
              onClick={() => {
                setSelectedOrder(order);
                if (isMobile) {
                  setIsModel(true);
                }
              }}
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
                  <p className="font-medium text-lg">{order.customer_name}</p>
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
              <div className="flex w-full justify-between gap-1 mt-4   items-end ">
                <p className="text-sm flex items-center max-w-[10ch] overflow-hidden ">
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

      {/* Center Panel - Live Tracking Map */}
      <Card
        hidden={isMobile && !isModel}
        className="lg:col-span-6 col-span-12 flex flex-col h-full  lg:max-h-[calc(100vh-80px)] overflow-hidden"
      >
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {t('details.title')}
          </CardTitle>
          <CardDescription>{t('details.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 overflow-y-auto hide-scrollbar snap-mandatory">
          {selectedOrder && (
            <>
              <Card className="p-6 flex flex-col">
                {/* Order ID */}
                <div className="text-gray-700 font-semibold">
                  {selectedOrder.fleetx_order_number}
                </div>

                {trackingData.map((item, idx) => (
                  <Fragment key={idx}>
                    <div className="flex items-start gap-3 bg-white z-0 flex-wrap">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center">
                        <span
                          style={{
                            background: `rgba(${item.icon.color}, 0.2)`,
                          }}
                          className="flex size-10 rounded-[6px] items-center justify-center relative z-10"
                        >
                          <item.icon.icon
                            className="w-5 h-5"
                            style={{ color: `rgb(${item.icon.color})` }}
                          />
                          <span
                            hidden={idx !== 0}
                            className="h-full max-[400px]:hidden w-px border border-dashed border-dark-grey/10 absolute -bottom-full left-1/2 -translate-x-1/2 -z-10"
                          />
                        </span>
                      </div>
                      <div className="flex-1 shrink-0 flex flex-col">
                        <p
                          hidden={item.type !== 'driver'}
                          className="text-sm text-dark-grey/70"
                        >
                          {t('tracking.driver.defult')}
                        </p>
                        <p className="font-medium text-dark-grey shrink-0 ">
                          {item.name}
                        </p>
                        <p className="text-sm text-dark-grey/70">
                          {item.location}
                        </p>
                      </div>
                      <a
                        href={item.cta.link}
                        className={cn(
                          'flex items-center gap-2 px-3 py-3 bg-off-white rounded-[6px] max-[400px]:w-full ',
                          item.type === 'driver' &&
                            'bg-[#059669] text-off-white'
                        )}
                      >
                        <Phone className="size-4" />{' '}
                        {item.type === 'driver'
                          ? t('tracking.driver.call')
                          : item.cta.label}
                      </a>
                    </div>

                    <hr hidden={idx !== 1} className="border-[#CAC4D0]" />
                  </Fragment>
                ))}
              </Card>

              {/* Map Container */}
              <Card className="p-0 ">
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
              </Card>
            </>
          )}
        </CardContent>
      </Card>

      {/* Right Panel - Order Details */}
      <Card
        hidden={isMobile && !isModel}
        className={cn(
          ' w-full lg:col-span-3 col-span-12 lg:max-h-[calc(100vh-80px)] overflow-hidden',
          isModel && 'lg:col-span-6 col-span-12'
        )}
      >
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            {t('tracking.title')}
          </CardTitle>
          <CardDescription>{t('tracking.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="flex  flex-col gap-4 overflow-y-auto hide-scrollbar snap-mandatory">
          {selectedOrder && (
            <>
              <div className="flex justify-between items-start">
                <div className="grid gap-1">
                  <p className="text-lg font-semibold">
                    {selectedOrder.customer_name}
                  </p>
                  <p className="text-sm text-[#1D1B20]/70">
                    {t('details.payment-method')}
                  </p>
                  <p className="text-sm text-[#1D1B20]/70">
                    {t('details.delivery-fee')}
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <Componet />

      {isMobile && isModel && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => {
            setSelectedOrder(null);
            setIsModel(false);
          }}
        >
          <DialogContent className="max-w-[90vw] max-h-[90vh] sm:max-w-max overflow-y-auto p-0 border-none">
            <DialogTitle asChild className="hidden"></DialogTitle>

            {selectedOrder && <Componet />}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default GridComponent;
