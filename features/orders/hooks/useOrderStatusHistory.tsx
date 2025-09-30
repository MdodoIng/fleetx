'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { orderService } from '@/shared/services/orders';
import {
  OrderStatusValues,
  TypeLiveOrderItem,
  TypeOrderStatusHistoryHistory,
  TypeStatusHistoryForUi,
} from '@/shared/types/orders';
import { useTranslations } from 'next-intl';
import { useVendorStore } from '@/store';

export function useOrderStatusHistory(order: TypeLiveOrderItem) {
  const [orderHistorys, setOrderHistorys] =
    useState<TypeOrderStatusHistoryHistory>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | unknown>(null);
  const { isEditDetails } = useVendorStore.getState();

  const fetchOrderHistory = useCallback(async () => {
    if (!order?.id || isEditDetails) return;
    try {
      setLoading(true);
      setError(null);
      const res = await orderService.getOrderStatusById(order.id);
      setOrderHistorys(res.data);
    } catch (err) {
      console.error('Error fetching order status history:', err);
      setError(err || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [order?.id, isEditDetails]);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);
  const t = useTranslations();

  const statusHistory: TypeStatusHistoryForUi[] = useMemo(() => {
    if (!orderHistorys) return [];
    return BuildStatusHistory(order, orderHistorys, t);
  }, [order, orderHistorys, t]);

  return {
    statusHistory,
    loading,
    error,
  };
}

function BuildStatusHistory(
  order: TypeLiveOrderItem,
  orderHistorys: TypeOrderStatusHistoryHistory,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any
): TypeStatusHistoryForUi[] {
  const base = [
    {
      id: OrderStatusValues.CONFIRMED.key,
      text: t(OrderStatusValues.CONFIRMED.label),
      time: order?.created_at,
      subText: '',
      display: true,
    },

    {
      id: OrderStatusValues.BUDDY_ASSIGNED.key,
      text: t(OrderStatusValues.BUDDY_ASSIGNED.label),
      time: null,
      subText: '',
      display: true,
    },
    {
      id: OrderStatusValues.BUDDY_UNASSIGNED.key,
      text: t(OrderStatusValues.BUDDY_UNASSIGNED.label),
      time: null,
      subText: '',
      display: false,
    },
    {
      id: OrderStatusValues.PICKUP_STARTED.key,
      text: t(OrderStatusValues.PICKUP_STARTED.label),
      time: null,
      subText: '',
      display: true,
    },
    {
      id: OrderStatusValues.ARRIVED_PICKUP.key,
      text: t(OrderStatusValues.ARRIVED_PICKUP.label),
      time: null,
      subText: '',
      display: true,
    },
    {
      id: OrderStatusValues.PICKED_UP.key,
      text: t(OrderStatusValues.PICKED_UP.label),
      time: null,
      subText: '',
      display: true,
    },
    {
      id: OrderStatusValues.RESCHEDULED.key,
      text: t(OrderStatusValues.RESCHEDULED.label),
      time: null,
      subText: '',
      display: orderHistorys?.status_history?.some(
        (h) => h.primary_order_status === OrderStatusValues.RESCHEDULED.key
      ),
    },
    {
      id: OrderStatusValues.IN_DELIVERY.key,
      text: t(OrderStatusValues.IN_DELIVERY.label),
      time: null,
      subText: '',
      display: true,
    },
    {
      id: OrderStatusValues.ARRIVED_DESTINATION.key,
      text: t(OrderStatusValues.ARRIVED_DESTINATION.label),
      time: null,
      subText: '',
      display: true,
    },
    {
      id: OrderStatusValues.DELIVERED.key,
      text: t(OrderStatusValues.DELIVERED.label),
      time: null,
      subText: '',
      display: true,
    },
  ];

  const formattedDate = (date: string | null) =>
    date ? new Date(date).toLocaleString() : null;

  const currentStatus =
    orderHistorys?.status_history?.[orderHistorys.status_history.length - 1]
      ?.primary_order_status;

  const currentIndex = base.findIndex((s) => Number(s.id) === currentStatus);

  return base
    .filter((item) => item.display)
    .map((step, index) => {
      const history = orderHistorys?.status_history.find(
        (h) => h.primary_order_status === step.id
      );

      const previousHistory = orderHistorys?.status_history.filter(
        (h) => h.created_at < (history?.created_at || order?.created_at)
      );

      let status: 'completed' | 'active' | 'inProgress' | 'pending' = 'pending';
      if (history) status = 'completed';
      else if (step.id === currentStatus) status = 'active';
      else if (index === currentIndex + 1) status = 'inProgress';

      return {
        ...step,
        time: history
          ? formattedDate(history.created_at)
          : status === 'inProgress'
            ? t(
                'component.features.orders.live.details.staus-history.in-progress'
              )
            : t('component.features.orders.live.details.staus-history.pending'),
        completed: status === 'completed',
        active: status === 'active',
        inProgress: status === 'inProgress',
        pending: status === 'pending',
        status,
        previousState:
          previousHistory?.length > 0
            ? previousHistory[previousHistory.length - 1].primary_order_status
            : null,
        currentState: history?.primary_order_status ?? null,
      };
    });
}
