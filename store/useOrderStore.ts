import { create } from 'zustand';
import { TypeDropOffs, TypeOrderList, TypePickUp } from '@/shared/types/orders';
import { persist } from 'zustand/middleware';

interface OrderState {
  driverId: number | null;
  dropOffs: TypeDropOffs[];
  pickUp: TypePickUp | undefined;

  // bulkDropOffs: BulkDropOff[];
  selectedDropOffs: TypeDropOffs[];
  // bulkValidation: BulkOrderValidation[];
  selectedPage: number;
  selectedPerPage: number;
  orderStatusListData: TypeOrderList[];
  totalCountList: number;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      driverId: null,
      dropOffs: [
        {
          id: 0,
          order_index: 0,
          display_address: '',
          address: '',
          vendor_order_id: '',
          customer_name: '',
          paci_number: '',
          area: '',
          area_id: 0,
          block: '',
          block_id: 0,
          street: '',
          street_id: 0,
          building_id: 0,
          building: '',
          floor: '',
          room_number: '',
          landmark: '',
          mobile_number: '',
          latitude: '',
          longitude: '',
          specific_driver_instructions: '',
          quantity: 0,
          amount_to_collect: 0,
          payment_type: 0,
        },
        {
          id: 0,
          order_index: 0,
          display_address: '',
          address: '',
          vendor_order_id: '',
          customer_name: '',
          paci_number: '',
          area: '',
          area_id: 0,
          block: '',
          block_id: 0,
          street: '',
          street_id: 0,
          building_id: 0,
          building: '',
          floor: '',
          room_number: '',
          landmark: '',
          mobile_number: '',
          latitude: '',
          longitude: '',
          specific_driver_instructions: '',
          quantity: 0,
          amount_to_collect: 0,
          payment_type: 0,
        },
      ],
      selectedDropOffs: [],
      selectedPage: 1,
      selectedPerPage: 10,
      orderStatusListData: [],
      totalCountList: 0,
      pickUp: undefined,
    }),
    {
      name: 'order-store', // key in localStorage
    }
  )
);
