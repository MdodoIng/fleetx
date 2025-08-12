import { create } from 'zustand';

export { useAuthStore } from './useAuthStore';

interface StorageState {
  vendorId: string;
  branchId: string;
  branchName: string;
  selectedVendorName: string;
  selectedBranchName: string;
  requiredMinWalletBalance: number;
  isLogOut: boolean;
  isUserGuide: boolean;
  hideLiveOrderSwiterOnUserGuidOnOtherPages: boolean;
  isSetPaginationAsInitialPage: boolean;
  ratingBackURL: string;
  vendorRatingData: any[];
  validVendorRatingData: any[];
  vendorDayRatingData: number;
  isAreaRestrictionEnabled: boolean;
  pickupAreaId: number | null;
  pickupArea: any[];
  unReadChatHistory: any[];
  notifyOrderNumberAgainstChat: string | null;
  notifactionPickStartedOrderId: string | null;
  notifactionCustomerAddressUpdateOrderId: string | null;
  marqueeDirection: string;
  setState: (state: Partial<StorageState>) => void;
}

export const useStore = create<StorageState>((set) => ({
  vendorId: '',
  branchId: '',
  branchName: '',
  selectedVendorName: '',
  selectedBranchName: '',
  requiredMinWalletBalance: 0,
  isLogOut: false,
  isUserGuide: false,
  hideLiveOrderSwiterOnUserGuidOnOtherPages: false,
  isSetPaginationAsInitialPage: false,
  ratingBackURL: '',
  vendorRatingData: [],
  validVendorRatingData: [],
  vendorDayRatingData: 0,
  isAreaRestrictionEnabled: false,
  pickupAreaId: null,
  pickupArea: [],
  unReadChatHistory: [],
  notifyOrderNumberAgainstChat: null,
  notifactionPickStartedOrderId: null,
  notifactionCustomerAddressUpdateOrderId: null,
  marqueeDirection:
    typeof window !== 'undefined' && localStorage.getItem('lang') === 'en'
      ? 'left'
      : 'right',
  setState: (state) => set(state),
}));
