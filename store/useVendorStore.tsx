import { create } from 'zustand';

import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';
import {
  TypeBranch,
  TypeVendor,
  TypeVendorList,
  TypeVendorUserList,
} from '@/shared/types/vendor';

export interface VendorState {
  branchDetails: TypeBranch[] | undefined;
  vendorId: string | null;
  branchId: string | null;
  branchName?: string | undefined;
  selectedVendorName: string | null;
  selectedVendor: TypeVendor | undefined;
  selectedBranch: TypeBranch | undefined;
  isVendorAdmin: boolean;
  selectedAccountManager: string | undefined;
  vendorList: TypeVendorList | undefined;
  isEditVendorId: string | undefined;
  isEditVendorBranchId: string | undefined;
  isEditUser: TypeVendorUserList | undefined;
  isEditDetails: boolean;
  showDriversFilter: boolean;

  isVendorAccess: boolean;
  isBranchAccess: boolean;
  isSearchVendorParams: string;
}

export interface VendorActions {
  clearAll: () => void;
  setValue: (key: keyof VendorState, value: any) => void;
  updateSelectedBranch: (branchId?: string) => void;
  getVendorAccountManagerId: () => void;
}

const initialState: VendorState = {
  branchDetails: undefined,
  branchName: undefined,
  selectedVendorName: null,
  selectedBranch: undefined,
  selectedVendor: undefined,
  branchId: null,
  vendorId: null,
  isVendorAdmin: false,
  selectedAccountManager: undefined,
  vendorList: undefined,
  isEditVendorId: undefined,
  isEditVendorBranchId: undefined,
  isEditUser: undefined,
  isEditDetails: false,
  showDriversFilter: false,
  isVendorAccess: false,
  isBranchAccess: false,
  isSearchVendorParams: '',
};

export const useVendorStore = create<VendorState & VendorActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setValue: (key: keyof VendorState, value: any) => set({ [key]: value }),
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
      name: 'vendor-storage',
    }
  )
);
