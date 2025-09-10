
import { get } from 'react-hook-form';
import { create } from 'zustand';

import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';
import { TypeBranch, TypeVenderList, TypeVenderListItem, TypeVendorUserList } from '@/shared/types/vender';

export interface VenderState {
  branchDetails: TypeBranch[] | undefined;
  vendorId: string | null;
  branchId: string | null;
  branchName: string | null;
  selectedVendorName: string | null;
  selectedVendor: TypeVenderListItem | undefined;
  selectedBranch: TypeBranch | undefined;
  isVendorAdmin: boolean;
  selectedAccountManager: string | undefined;
  venderList: TypeVenderList | undefined;
  isEditVenderId: string | undefined;
  isEditVenderBranchId: string | undefined;
  isEditUser: TypeVendorUserList | undefined;
}

export interface VenderActions {
  clearAll: () => void;
  setValue: (key: keyof VenderState, value: any) => void;
  updateSelectedBranch: (branchId?: string) => void;
  getVendorAccountManagerId: () => void;
}

const initialState: VenderState = {
  branchDetails: undefined,
  branchName: null,
  selectedVendorName: null,
  selectedBranch: undefined,
  selectedVendor: undefined,
  branchId: null,
  vendorId: null,
  isVendorAdmin: false,
  selectedAccountManager: undefined,
  venderList: undefined,
  isEditVenderId: undefined,
  isEditVenderBranchId: undefined,
  isEditUser: undefined,
};

export const useVenderStore = create<VenderState & VenderActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setValue: (key: keyof VenderState, value: any) => set({ [key]: value }),
      updateSelectedBranch: (branchId) => {
        if (!branchId) {
        }
      },

      getVendorAccountManagerId: () => {
        const { user } = useAuthStore.getState();
        if (user?.roles.includes('VENDOR_ACCOUNT_MANAGER')) {
          const selectedAccountManager = get().selectedAccountManager;
          set({
            selectedAccountManager: selectedAccountManager
              ? selectedAccountManager
              : user?.user.user_id,
          });
        }
      },

      clearAll: () => set({ ...initialState }),
    }),

    {
      name: 'vender-storage',
    }
  )
);
