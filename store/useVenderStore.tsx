import { TypeBranch, TypeVender } from '@/shared/types/vender';
import { create } from 'zustand';

import { persist } from 'zustand/middleware';

export interface VenderState {
  branchDetails: TypeBranch[] | undefined;
  vendorId: string | null;
  branchId: string | null;
  branchName: string | null;
  selectedVendorName: string | null;
  selectedVendor: TypeVender | undefined;
  selectedBranch: TypeBranch | undefined;
}

export interface VenderActions {
  clearAll: () => void;
  setValue: (key: keyof VenderState, value: any) => void;
}

export const useVenderStore = create<VenderState & VenderActions>()(
  persist(
    (set, get) => ({
      branchDetails: undefined,
      branchName: null,
      selectedVendorName: null,
      selectedBranch: undefined,
      selectedVendor: undefined,
      branchId: null,
      vendorId: null,

      setValue: (key: keyof VenderState, value: any) => set({ [key]: value }),

      clearAll: () =>
        set({
          vendorId: null,
          branchId: null,
          branchName: null,
          selectedVendor: undefined,
          selectedBranch: undefined,
        }),
    }),
    {
      name: 'vender-storage',
    }
  )
);
