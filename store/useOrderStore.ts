import {
  TypeDelivery,
  TypeDropOffs,
  TypeEstimatedDelivery,
  TypeOrderList,
  TypePickUp,
} from '@/shared/types/orders';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderState {
  driverId: number | null;
  dropOffs: TypeDropOffs[];
  pickUp: TypePickUp | undefined;
  estimatedDelivery: TypeEstimatedDelivery | undefined;
  deliveryModel: (typeof TypeDelivery)[number];
  selectedDropOffs: TypeDropOffs[];
  selectedPage: number;
  selectedPerPage: number;
  orderStatusListData: TypeOrderList[];
  totalCountList: number;
  updateDeliveryModel: (deliveryModel: number) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      driverId: null,
      dropOffs: [],
      selectedDropOffs: [],
      selectedPage: 1,
      selectedPerPage: 10,
      orderStatusListData: [],
      totalCountList: 0,
      pickUp: undefined,
      estimatedDelivery: undefined,
      deliveryModel: TypeDelivery[0],
      updateDeliveryModel: (deliveryModel: number) => {
        const delivery = TypeDelivery.find((x) => x.key === deliveryModel);
        set({ deliveryModel: delivery ? delivery : TypeDelivery[0] });
      },
    }),
    {
      name: 'order-store',
    }
  )
);
