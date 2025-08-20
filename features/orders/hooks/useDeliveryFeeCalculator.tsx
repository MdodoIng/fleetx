'use client';

import {
  TypeDelivery,
  TypeEstimatedDeliveryReturnFromApi,
} from '@/shared/types/orders';
import { useSharedStore } from '@/store';
import { useState, useMemo } from 'react';

export const useDeliveryFeeCalculator = (
  orderService: TypeEstimatedDeliveryReturnFromApi
) => {
  const { appConstants } = useSharedStore();
  const deliveryEstimate = useMemo(() => {
    const totalOrders = orderService?.data.drop_offs?.length || 0;

    let totalKMs = 0;
    let totalDeliveryFee = 0;
    let estTime = 0;

    // Find delivery model
    const delivery = TypeDelivery.find(
      (x) => x.key === orderService?.data.delivery_model
    );
    const deliveryModel = delivery?.value || '';

    // Calculate totals
    orderService?.data.drop_offs?.forEach((element) => {
      totalDeliveryFee += element.delivery_fee || 0;
      totalKMs += element.delivery_distance || 0;
      estTime = element.delivery_duration;
    });

    return {
      totalOrders,
      totalDelivery: `${totalDeliveryFee.toFixed(2)} ${appConstants?.currency}`,
      totalKM: `${totalKMs.toFixed(2)} KM`,
      deliveryModel,
      estTime,
    };
  }, []);

  return {
    ...orderService,
    ...deliveryEstimate,
  };
};
