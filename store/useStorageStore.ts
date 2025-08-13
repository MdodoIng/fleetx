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

  getSessionStorage: (key: string) => string | null;
  addSessionStorage: (key: string, value: string) => void;
  removeSessionStorage: (key: string) => void;
  clearSessionStorage: () => void;
  addLocalStorage: (key: string, value: string) => void;
  getLocalStorage: (key: string) => string | null;
  removeLocalStorage: (key: string) => void;
  clearLocalStorage: () => void;
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

      getSessionStorage: (key: string) => {
        if (typeof sessionStorage === 'undefined') return null;
        return sessionStorage.getItem(key);
      },

      addSessionStorage: (key: string, value: string) => {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(key, value);
        }
      },

      removeSessionStorage: (key: string) => {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem(key);
        }
      },

      clearSessionStorage: () => {
        if (typeof sessionStorage !== 'undefined') {
          const keys = Object.keys(sessionStorage);
          keys.forEach((key) => {
            sessionStorage.removeItem(key);
          });
        }
      },

      addLocalStorage: (key: string, value: string) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, value);
        }
      },

      getLocalStorage: (key: string) => {
        if (typeof localStorage === 'undefined') return null;
        return localStorage.getItem(key);
      },

      removeLocalStorage: (key: string) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
        }
      },

      clearLocalStorage: () => {
        if (typeof localStorage !== 'undefined') {
          const keys = Object.keys(localStorage);
          keys.forEach((key) => {
            localStorage.removeItem(key);
          });
        }
      },
    }),
    {
      name: 'storage-store', // key in localStorage
    }
  )
);
