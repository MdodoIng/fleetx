'use client';
import {
  OrderStatusValues,
  TypeOrderHistoryList,
  TypeOrderList,
  TypeOrderStatusHistoryHistory,
  TypeStatusHistoryForUi,
} from '@/shared/types/orders';
import { useEffect, useMemo, useState } from 'react';
import { orderService } from '../services/ordersApi';

function buildStatusHistory(
  order: TypeOrderHistoryList,
  orderHistorys: TypeOrderStatusHistoryHistory
): TypeStatusHistoryForUi[] {
  const base: TypeStatusHistoryForUi[] = [
    {
      id: OrderStatusValues.CONFIRMED,
      text: 'Your order is confirmed',
      time: order.created_at,
      subText: '',
      active: false,
      completed: false,
      display: true,
    },
    {
      id: OrderStatusValues.BUDDY_ASSIGNED,
      text: 'Buddy is assigned',
      time: null,
      subText: '',
      active: false,
      completed: false,
      display: true,
    },
    {
      id: OrderStatusValues.BUDDY_UNASSIGNED,
      text: 'Buddy is unassigned',
      time: null,
      subText: '',
      active: false,
      completed: false,
      display: false, // hidden by default
    },
    {
      id: OrderStatusValues.PICKUP_STARTED,
      text: 'Buddy is on the way to pickup',
      time: null,
      subText: '',
      active: false,
      completed: false,
      display: true,
    },
    {
      id: OrderStatusValues.ARRIVED_PICKUP,
      text: 'Arrived at pickup location',
      time: null,
      subText: '',
      active: false,
      completed: false,
      display: true,
    },
    {
      id: OrderStatusValues.PICKED_UP,
      text: 'Your order has been picked up',
      time: null,
      subText: '',
      active: false,
      completed: false,
      display: true,
    },
    {
      id: OrderStatusValues.RESCHEDULED,
      text: 'Your order has been rescheduled',
      time: null,
      subText: '',
      active: false,
      completed: false,
      display: orderHistorys?.status_history?.some(
        (h) => h.primary_order_status === OrderStatusValues.RESCHEDULED
      ),
    },
    {
      id: OrderStatusValues.IN_DELIVERY,
      text: 'Your order is on the way',
      time: null,
      subText: '',
      active: false,
      completed: false,
      display: true,
    },
    {
      id: OrderStatusValues.ARRIVED_DESTINATION,
      text: 'Your order has reached the destination',
      time: null,
      subText: '',
      active: false,
      completed: false,
      display: true,
    },
    {
      id: OrderStatusValues.DELIVERED,
      text: 'Delivered successfully',
      time: null,
      subText: '',
      active: false,
      completed: false,
      display: true,
    },
  ];

  // get last (current) status
  const current =
    orderHistorys?.status_history[orderHistorys?.status_history?.length - 1]
      ?.primary_order_status;

  // map over base to mark completed/active & add times
  return base.map((s) => {
    const history = orderHistorys?.status_history.find(
      (h) => h.primary_order_status === s.id
    );
    return {
      ...s,
      time: history ? history.created_at : s.time,
      completed: history ? true : false,
      active: s.id === current,
    };
  });
}

export function useOrderStatusHistory(order: TypeOrderHistoryList) {
  const [orderHistorys, setOrderHistorys] =
    useState<TypeOrderStatusHistoryHistory>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await orderService.getOrderStatusById(order.id);
        setOrderHistorys(res.data);
      } catch (err: any) {
        console.error(
          'Error fetching order status history:',
          err || 'An unknown error occurred'
        );
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadInitialOrders();
  }, [order.id]);

  console.log(orderHistorys,order.id, "af")



  const statusHistory = useMemo(
    () => buildStatusHistory(order, orderHistorys!),
    [order, orderHistorys]
  );

  return {
    statusHistory,
    loading,
    error,
    refetch: () => {
      const loadOrders = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await orderService.getOrderStatusById(order.id);
          setOrderHistorys(res.data);
        } catch (err: any) {
          setError(err.message || 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      };
      loadOrders();
    },
  };
}
