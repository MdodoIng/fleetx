// store/useStorageStore.ts
'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type StorageState = {
  vendorId: string | null;
  branchId: string | null;
  branchName: string | null;
  selectedVendorName: string | null;
  selectedBranchName: string | null;
  requiredMinWalletBalance: number | null;
  isLogOut: boolean;
  isUserGuide: boolean;
  hideLiveOrderSwiterOnUserGuidOnOtherPages: boolean;
  isSetPaginationAsInitialPage: boolean;
  ratingBackURL: string | null;
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
  marqueeDirection: 'left' | 'right';

  // Actions
  setField: <K extends keyof StorageState>(
    key: K,
    value: StorageState[K]
  ) => void;
  clearAll: () => void;

  // Utils
  isMobile: () => boolean;
  getFormattedDate: (date: Date) => string;
};

export const useStorageStore = create<StorageState>()(
  persist(
    (set, get) => ({
      vendorId: null,
      branchId: null,
      branchName: null,
      selectedVendorName: null,
      selectedBranchName: null,
      requiredMinWalletBalance: null,
      isLogOut: false,
      isUserGuide: false,
      hideLiveOrderSwiterOnUserGuidOnOtherPages: false,
      isSetPaginationAsInitialPage: false,
      ratingBackURL: null,
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

      setField: (key, value) => set({ [key]: value } as Partial<StorageState>),

      clearAll: () =>
        set({
          vendorId: null,
          branchId: null,
          branchName: null,
          selectedVendorName: null,
          selectedBranchName: null,
          requiredMinWalletBalance: null,
          isLogOut: false,
          isUserGuide: false,
          hideLiveOrderSwiterOnUserGuidOnOtherPages: false,
          isSetPaginationAsInitialPage: false,
          ratingBackURL: null,
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
        }),

      isMobile: () => {
        if (typeof navigator === 'undefined') return false;
        const toMatch = [
          /Android/i,
          /webOS/i,
          /iPhone/i,
          /iPod/i,
          /BlackBerry/i,
          /Windows Phone/i,
        ];
        return toMatch.some((regex) => navigator.userAgent.match(regex));
      },

      getFormattedDate: (date: Date) =>
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2),
    }),
    {
      name: 'storage-store', // key in localStorage
    }
  )
);
