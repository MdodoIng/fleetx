import {
  TypeDelivery,
  TypeDropOffs,
  TypeEstimatedDelivery,
  TypeEstimatedDeliveryReturnFromApi,
  TypeOrderList,
  TypePickUp,
} from '@/shared/types/orders';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSharedStore } from './sharedStore';

interface DeliverySummary {
  totalOrders: number;
  totalDelivery: string;
  totalKM: string;
  deliveryModel: string;
  estTime: number;
}

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
  estimatedDeliveryReturnFromApi:
    | TypeEstimatedDeliveryReturnFromApi
    | undefined;
  deliverySummary: DeliverySummary | null;

  updateDeliveryModel: (deliveryModel: number) => void;
  setEstimatedDeliveryReturnFromApi: (
    data: TypeEstimatedDeliveryReturnFromApi
  ) => void;
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
      estimatedDeliveryReturnFromApi: undefined,
      deliverySummary: null,

      updateDeliveryModel: (deliveryModel: number) => {
        const delivery = TypeDelivery.find((x) => x.key === deliveryModel);
        set({ deliveryModel: delivery ? delivery : TypeDelivery[0] });
      },

      setEstimatedDeliveryReturnFromApi: (data) => {
        const { appConstants } = useSharedStore.getState();

        let totalOrders = data?.data.drop_offs?.length || 0;
        let totalKMs = 0;
        let totalDeliveryFee = 0;
        let estTime = 0;

        const delivery = TypeDelivery.find(
          (x) => x.key === data?.data.delivery_model
        );
        const deliveryModel = delivery?.value || '';

        data?.data.drop_offs?.forEach((element) => {
          totalDeliveryFee += element.delivery_fee || 0;
          totalKMs += element.delivery_distance || 0;
          estTime = element.delivery_duration;
        });

        const summary: DeliverySummary = {
          totalOrders,
          totalDelivery: `${totalDeliveryFee.toFixed(2)} ${appConstants?.currency}`,
          totalKM: `${totalKMs.toFixed(2)} KM`,
          deliveryModel,
          estTime,
        };

        set({
          estimatedDeliveryReturnFromApi: data,
          deliverySummary: summary,
        });
      },
    }),

    {
      name: 'order-store',
    }
  )
);
