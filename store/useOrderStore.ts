import { create } from 'zustand';
import {
  DropOff,
  BulkDropOff,
  BulkOrderValidation,
  OrderList,
} from '@/shared/types/orders';

interface OrderState {
  driverId: number | null;
  dropOffs: DropOff[];
  bulkDropOffs: BulkDropOff[];
  selectedDropOffs: DropOff[];
  bulkValidation: BulkOrderValidation[];
  selectedPage: number;
  selectedPerPage: number;
  orderStatusListData: OrderList[];
  totalCountList: number;

  // actions
  setDriverId: (id: number | null) => void;
  setDropOffs: (dropOffs: DropOff[]) => void;
  setBulkDropOffs: (bulk: BulkDropOff[]) => void;
  setSelectedDropOffs: (selected: DropOff[]) => void;
  setBulkValidation: (errors: BulkOrderValidation[]) => void;
  setOrderList: (list: OrderList[], total: number) => void;
  setPagination: (page: number, perPage: number) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  driverId: null,
  dropOffs: [],
  bulkDropOffs: [],
  selectedDropOffs: [],
  bulkValidation: [],
  selectedPage: 1,
  selectedPerPage: 10,
  orderStatusListData: [],
  totalCountList: 0,

  setDriverId: (id) => set({ driverId: id }),
  setDropOffs: (dropOffs) => set({ dropOffs }),
  setBulkDropOffs: (bulk) => set({ bulkDropOffs: bulk }),
  setSelectedDropOffs: (selected) => set({ selectedDropOffs: selected }),
  setBulkValidation: (errors) => set({ bulkValidation: errors }),
  setOrderList: (list, total) =>
    set({ orderStatusListData: list, totalCountList: total }),
  setPagination: (page, perPage) =>
    set({ selectedPage: page, selectedPerPage: perPage }),
}));
