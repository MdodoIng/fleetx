import { create } from 'zustand';
import { kuwait, bahrain, qatar } from '@/shared/constants/countryConstants';
import {
  storageConstants,
  commonConstants,
  KUWAIT,
  BAHRAIN,
  QATAR,
} from '@/shared/constants/storageConstants';

import { TypeZoneETPTrend } from '@/shared/types/orders';
import { persist } from 'zustand/middleware';

import {
  checkZoneBusyModeIsEnabled,
  getDiffrenceBwCurrentAndLastUpdatedETP,
  logError,
  // toValidateOperationalHours,
  toValidateOperationalHours,
} from '@/shared/services';

export interface SharedState {
  surveyCount: number;
  isOnline: boolean;
  smsPathURL?: string;
  resetPasswordPathUrl?: string;
  currentRates?: number;
  orderNumberRate?: string;
  improvements: any[];
  appConstants: typeof kuwait | typeof bahrain | typeof qatar | null;
  rate: number | null;
  foodicsReference: string | null;
  foodicsIsAlreadyConnected?: boolean;
  foodicsCanceledMessage: boolean;
  foodicsAssociatedToVendorAdmin: boolean;
  isRateFirstOrderPickUp: boolean;
  whatsAppUpdateAddress: any;
  whatsAppUpdateAddressMessage: any;
  fleetZonePickUpTrend: [] | undefined;
  freeDriverData: any[];
  currentStatusZoneETPTrend: TypeZoneETPTrend | undefined;
  currentZoneId?: number;
  defaultZoneId?: number;
  isAthuGurad: boolean;
  operationalHours: any;
  activeBusyModeDetails: any;
  defaultBusyModeDetails: any;
  isShowVersionUpdateBtn: boolean;
  switchToGridView: boolean;
  isShowSwitchButtonInLiveOrder: boolean;
  isShowTopArrowWhileScroll: boolean;
  isEnglishShowTopArrowButton: boolean;
  bulkOrderNo?: string;
  encryptedBulkOrderNo?: string;
  bulkOrderPrimaryStatus?: number;
  isValidCancelOrReschedule?: boolean;
  lastPathname: string | undefined;
  isCollapsed: boolean;
  showLanguage: boolean;
}

export interface SharedActions {
  readAppConstants: () => Promise<void>;
  verifyAppVersionUpdate: (apiVersion: string) => void;
  calculateTrendToShowETP: (zoneDetail: any, freeBuddies: any) => void;
  // Add other actions that modify state here

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
  setValue: (key: keyof SharedState, value: any) => void;
  clearAll: () => unknown;
}

const initialState: SharedState = {
  surveyCount: 0,
  isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
  smsPathURL: undefined,
  resetPasswordPathUrl: undefined,
  currentRates: undefined,
  orderNumberRate: undefined,
  improvements: [],
  appConstants: null,
  rate: null,
  foodicsReference: null,
  foodicsIsAlreadyConnected: undefined,
  foodicsCanceledMessage: false,
  foodicsAssociatedToVendorAdmin: false,
  isRateFirstOrderPickUp: false,
  whatsAppUpdateAddress: null,
  whatsAppUpdateAddressMessage: null,
  fleetZonePickUpTrend: [],
  freeDriverData: [],
  currentStatusZoneETPTrend: undefined,
  currentZoneId: undefined,
  defaultZoneId: undefined,
  isAthuGurad: false,
  operationalHours: null,
  activeBusyModeDetails: null,
  defaultBusyModeDetails: null,
  isShowVersionUpdateBtn: false,
  switchToGridView: false,
  isShowSwitchButtonInLiveOrder: false,
  isShowTopArrowWhileScroll: false,
  isEnglishShowTopArrowButton: false,
  bulkOrderNo: undefined,
  encryptedBulkOrderNo: undefined,
  bulkOrderPrimaryStatus: undefined,
  isValidCancelOrReschedule: undefined,
  isCollapsed: false,
  showLanguage: true,
  lastPathname: undefined,
};

export const useSharedStore = create<SharedState & SharedActions>()(
  persist(
    (set, get) => {
      // Private helper functions within the store's scope

      return {
        ...initialState,
        lastPathname: undefined,
        // Actions

        setValue: (key: keyof SharedState, value: any) => set({ [key]: value }),
        clearAll: () => set({ ...initialState }),
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

        setState: (partialState: Partial<SharedState>) => set(partialState),
        setFoodicsIsAlreadyConnected: (isConnected: boolean) =>
          set({ foodicsIsAlreadyConnected: isConnected }),

        readAppConstants: async () => {
          const country = process.env.COUNTRY!.toLowerCase();
          let appConstants = null;

          switch (country) {
            case KUWAIT:
              appConstants = kuwait;
              break;
            case BAHRAIN:
              appConstants = bahrain;
              break;
            case QATAR:
              appConstants = qatar;
              break;
            default:
              console.warn(`Unknown country: ${country}`);
          }

          set({ appConstants: appConstants });
        },

        verifyAppVersionUpdate: (apiVersion: string) => {
          const { getLocalStorage, addLocalStorage, removeLocalStorage } =
            get();
          if (apiVersion.trim() !== process.env.APP_VERSION) {
            const popupDisplayedVersion = getLocalStorage(
              storageConstants.app_version
            );
            if (popupDisplayedVersion !== apiVersion) {
              addLocalStorage(storageConstants.app_version, apiVersion);
              // In React, you wouldn't use a callback. A component would just
              // re-render because isShowVersionUpdateBtn has changed.
            }
            set({ isShowVersionUpdateBtn: true });
          } else {
            set({ isShowVersionUpdateBtn: false });
            removeLocalStorage(storageConstants.app_version);
          }
        },

        calculateTrendToShowETP: (zoneDetail: any, freeBuddies: any) => {
          const { operationalHours, activeBusyModeDetails } = get();
          const { getLocalStorage } = get();
          const branchId = getLocalStorage(storageConstants.branch_id) || '';

          if (
            !toValidateOperationalHours() ||
            !freeBuddies ||
            !zoneDetail ||
            !checkZoneBusyModeIsEnabled() ||
            !branchId
          ) {
            set({ currentStatusZoneETPTrend: undefined });
            return;
          }

          const newTrend: TypeZoneETPTrend = {
            etpMins: 0,
            etpMoreThanConfigValue: false,
            avgPromisedETP: 0,
            isEnable: false,
            freeBuddies: 0,
          };

          const freeDrivers = freeBuddies?.freeBuddies ?? 0;
          const unAssignedDrivers = freeBuddies?.unAssignedOrders ?? 0;
          const currentBuddies = freeDrivers - unAssignedDrivers;

          newTrend.freeBuddies = currentBuddies;
          newTrend.isEnable = zoneDetail?.need_ui_display;
          newTrend.avgPromisedETP = Math.round(
            zoneDetail.avg_pickup_duration / 60
          );

          const minuteETP = getDiffrenceBwCurrentAndLastUpdatedETP(zoneDetail);

          if (currentBuddies > 0) {
            if (minuteETP <= 0) {
              newTrend.etpMins = commonConstants.orderTransparencyMaxMins;
              newTrend.etpMoreThanConfigValue = false;
            } else if (minuteETP >= commonConstants.orderTransparencyMaxMins) {
              newTrend.etpMins = commonConstants.orderTransparencyMaxMins;
              newTrend.etpMoreThanConfigValue = true;
            } else {
              newTrend.etpMins = minuteETP < 5 ? 5 : minuteETP;
              newTrend.etpMoreThanConfigValue = false;
            }
          } else {
            newTrend.etpMins = commonConstants.orderTransparencyMaxMins;
            newTrend.etpMoreThanConfigValue = true;
          }

          set({ currentStatusZoneETPTrend: newTrend });
          // addGoogleTag();
        },
      };
    },
    {
      name: 'shared-storage',
    }
  )
);
