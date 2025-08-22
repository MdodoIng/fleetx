import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

import { toast } from 'sonner';
import { environment } from '@/environments/environment';
import { ErrorMessages } from '@/shared/constants/commonMessages';
import { kuwait, bahrain, qatar } from '@/shared/constants/countryConstants';
import {
  storageConstants,
  commonConstants,
  KUWAIT,
  BAHRAIN,
  QATAR,
} from '@/shared/constants/storageConstants';
import { configService } from '@/shared/services/app-config';
import { setUserLocale } from '@/shared/services/locale';
import { AuthData, DecodedToken } from '@/shared/types/auth';
import { useTranslations, Locale } from 'next-intl';
import { TypeZoneETPTrend } from '@/shared/types/orders';
import { apiFetch } from '@/shared/lib/utils';
import { persist } from 'zustand/middleware';
import { TypeBranch, TypeVender } from '@/shared/types/vender';
import { useVenderStore } from './useVenderStore';

type ToastStatus = 'success' | 'info' | 'warning' | 'error' | 'default';

export const getArea = () =>
  apiFetch(environment.API_GATEWAY_BASE_URL + '/locs/areas', {
    cache: 'force-cache',
  });
export const getAreaByPickupAreaId = (id: string) =>
  apiFetch(
    environment.API_GATEWAY_BASE_URL + '/locs/allowed/drop-off/areas/' + id,
    {
      cache: 'force-cache',
    }
  );
export const getBlock = (id: string) =>
  apiFetch(environment.API_GATEWAY_BASE_URL + '/locs/areas/' + id + '/blocks', {
    cache: 'force-cache',
  });
export const getStreet = (id: string) =>
  apiFetch(
    environment.API_GATEWAY_BASE_URL + '/locs/blocks/' + id + '/streets',
    {
      cache: 'force-cache',
    }
  );
export const getBuildings = (id: string) =>
  apiFetch(
    environment.API_GATEWAY_BASE_URL + '/locs/streets/' + id + '/buildings',
    {
      cache: 'force-cache',
    }
  );

export const getDeliveryRate = (request: any) =>
  apiFetch(+'/order/delivery/' + request);
export const getCurrentIPInfo = () => apiFetch('http://ipinfo.io/json'); // Note: client-side only
export const getCurrentIPWhois = () =>
  apiFetch('https://ipwhois.app/json/?lang=en'); // Note: client-side only
export const connectFoodics = () =>
  apiFetch(configService.userServiceApiUrl() + '/foodics/connect');
export const associateFoodics = (request: any) =>
  apiFetch(configService.vendorServiceApiUrl() + '/foodics/branch/associate', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
export const validateVerifyCustomerAddress = (request: string) =>
  apiFetch(
    configService.orderServiceApiUrl() + '/validate/customer/address/' + request
  );
export const verifyCustomerAddress = (request: any) =>
  apiFetch(configService.orderServiceApiUrl() + '/verify/customer/address', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });

export const getAllFreeBuddiesFromB2C = () =>
  apiFetch(environment.B2C_BASE_URL + 'zoningPushZoneMetric');
export const getSuperSaverPromation = (vendorId: string, branchId: string) =>
  apiFetch(
    configService.finServiceApiUrl() +
      '/super-saver-promotion-status/vendor/' +
      vendorId +
      '/branch/' +
      branchId
  );

export const getFirstOrderInsight = (fromDate: Date, toDate: Date) => {
  const { getFormattedDate } = useSharedStore();
  const params = new URLSearchParams({
    from_date: getFormattedDate(fromDate),
    to_date: getFormattedDate(toDate),
  });
  return apiFetch(
    configService.rateServiceApiUrl() +
      `/first-order/insight?${params.toString()}`
  );
};
export const getFirstOrderList = (url: string) =>
  apiFetch(configService.rateServiceApiUrl() + url);
export const getFirstOrderPickUpRate = (value: any) =>
  apiFetch(
    configService.rateServiceApiUrl() + '/first/order/pickup/rating/' + value
  );

export const checkBlockActivation = (vendorId: string, branchId?: string) => {
  const url = branchId ? `${vendorId}/${branchId}` : vendorId;
  return apiFetch(
    configService.finServiceApiUrl() + '/wallet/recharge/blocked/' + url
  );
};

export const getZone = (request: any) =>
  apiFetch(configService.orderServiceApiUrl() + '/pickup/address/zone', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
export const getFleetZonePickUpTrendAPI = () =>
  apiFetch(configService.fleetServiceApiUrl() + '/zone-pickup/trend');
export const getFleetZonePickUpTrendAPINew = () =>
  apiFetch(configService.awsApiGatewayBaseUrl() + '/zone/pickup-agg-data');
export const getBulkOrderDetails = (encryptedOrderNo: string) =>
  apiFetch(
    configService.orderServiceApiUrl() +
      '/get-customer-bulk-order/' +
      encryptedOrderNo
  );

export const getCurrentUser = (): AuthData | undefined => {
  const { getLocalStorage } = useSharedStore.getState();
  const currentUserStr = getLocalStorage(storageConstants.user_context);
  if (currentUserStr && currentUserStr !== 'null') {
    return JSON.parse(currentUserStr);
  }
  return undefined;
};

export const getDecodedAccessToken = (token?: string): DecodedToken | null => {
  let tokenToDecode = token;
  if (!tokenToDecode) {
    const currentUser = getCurrentUser();
    if (currentUser?.token) {
      tokenToDecode = currentUser.token;
    }
  }
  if (tokenToDecode) {
    try {
      return jwtDecode<DecodedToken>(tokenToDecode);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }
  return null;
};

export const removeArabicFromAddress = (address: string): string => {
  if (!address) return '';
  try {
    const index = address.indexOf('[');
    if (index !== -1) {
      const value = address.substring(0, index);
      return value.trim();
    }
    return address;
  } catch (error) {
    return address;
  }
};

export const showToast = (status: ToastStatus, message: string) => {
  const options = { id: message }; // Prevents duplicates
  switch (status) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    default:
      toast.info(message, options);
  }
};

export const showServerMessage = (status: ToastStatus, resMessage: string) => {
  const { getLocalStorage } = useSharedStore();
  const t = useTranslations();
  const lang = getLocalStorage('lang') as Locale;
  if (!lang) {
    setUserLocale('en');
  } else {
    // @ts-ignore
    setUserLocale(lang);
  }

  if (!resMessage) return;

  const message = ErrorMessages.find((x) => x.key === resMessage);
  let realMessage: string;

  if (message) {
    const key = `apiMessages.${resMessage}`;
    realMessage = t(key, { defaultValue: message.value });
  } else {
    realMessage = t('commonMessages.errorMessage');
  }

  showToast(status, realMessage);
};

export const logError = (message: string, ...optionalParams: any[]) => {
  console.error(message, ...optionalParams);
};

export const getUserEnteredRegionInConfig = (url: string): string => {
  const region = environment.REGIONS.find((element) =>
    url.includes(element.domain)
  );
  return region ? region.domain : '';
};

export const getRegionBasedOnCountry = (country: string) => {
  return environment.REGIONS.find(
    (x) => x.country_code.toLowerCase() === country.toLowerCase()
  );
};

export const get24to12 = (time: string): string => {
  if (!time) return '';
  let [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const sHours = hours.toString().padStart(2, '0');
  const sMinutes = minutes.toString().padStart(2, '0');
  return `${sHours}:${sMinutes} ${ampm}`;
};

export const getUTCToLocal = (time: string): string => {
  const date = new Date(`1970-01-01T${time}Z`);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export const formatPhoneNumber = (phoneNumberString: string): string => {
  if (!phoneNumberString) return '';
  try {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    if (cleaned.length === 8) {
      const match = cleaned.match(/^(\d{2})(\d{2})(\d{4})$/);
      return match ? `${match[1]} ${match[2]} ${match[3]}` : phoneNumberString;
    } else if (cleaned.length === 11) {
      const match = cleaned.match(/^(\d{3})(\d{2})(\d{2})(\d{4})$/);
      return match
        ? `(${match[1]}) ${match[2]} ${match[3]} ${match[4]}`
        : phoneNumberString;
    }
    return phoneNumberString;
  } catch (error) {
    return phoneNumberString;
  }
};

export const convertToCSV = (objArray: any[], headerList: string[]): string => {
  const replacer = (_key: any, value: any) => (value === null ? '' : value);
  const csv = [
    headerList.join(','),
    ...objArray.map((obj) =>
      headerList
        .map((fieldName) => JSON.stringify(obj[fieldName], replacer))
        .join(',')
    ),
  ].join('\n');
  return csv;
};

export const clearSupportChat = () => {
  // This must be called from a Client Component
  document.querySelectorAll('.message-container').forEach((el) => el.remove());
};
const toValidateOperationalHours = () => {
  const { operationalHours } = useSharedStore.getState();
  if (!operationalHours) return false;
  if (operationalHours.full_day_operational) return true;

  const now = new Date();
  const [startHours, startMinutes] = operationalHours.start_time
    .split(':')
    .map(Number);
  const [endHours, endMinutes] = operationalHours.end_time
    .split(':')
    .map(Number);

  const fromDate = new Date(now);
  fromDate.setHours(startHours, startMinutes, 0, 0);

  const toDate = new Date(now);
  toDate.setHours(endHours, endMinutes, 0, 0);

  if (operationalHours.next_day && toDate < fromDate) {
    toDate.setDate(toDate.getDate() + 1);
  }

  return now >= fromDate && now <= toDate;
};

const checkZoneBusyModeIsEnabled = () => {
  const { activeBusyModeDetails } = useSharedStore();
  if (!activeBusyModeDetails) return false;
  const now = new Date();
  const activatedAt = new Date(activeBusyModeDetails.activated_at);
  const expiredAt = new Date(activeBusyModeDetails.expired_at);
  return now > activatedAt && now < expiredAt;
};

const getDiffrenceBwCurrentAndLastUpdatedETP = (zoneDetail: any) => {
  if (!zoneDetail?.updated_at) return 0;
  const updatedAt = new Date(zoneDetail.updated_at);
  const now = new Date();
  const minutes = Math.abs(now.getTime() - updatedAt.getTime()) / 60000;
  if (
    Math.round(minutes) <=
    commonConstants.orderTransparencyLastUpdatedTimeConfigMins
  ) {
    return Math.round(zoneDetail.avg_pickup_duration / 60);
  }
  return 0;
};

const setSuperSaverWalletInfoMessage = (data: any) => {
  const t = useTranslations('screens');
  let messages: string[] = [];
  if (!data.achieved_supersaver && data.active) {
    messages.push(t('newOrder.superSaver.push10OrMoreOrders'));
    messages.push(t('newOrder.superSaver.save50FilsForEachOrder'));
  }
  return messages;
};

// const addGoogleTag = () => {
//   const { eventEmitter } = useAnalytics();
//   const { currentStatusZoneETPTrend, currentZoneId } = get();
//   const currentUser = getDecodedAccessToken();
//   const branchId = storage.getLocalStorage(storageConstants.branch_id);

//   const role = currentUser?.roles?.[0];

//   if (role === ROLES.vendor_user && branchId && currentStatusZoneETPTrend) {
//     const branchName =
//       storage.getLocalStorage(storageConstants.branch_name) || '';
//     const selectedBranchName =
//       storage.getLocalStorage(storageConstants.selected_branch_name) || '';

//     let eventName = currentUser.user.vendor.branch_id
//       ? branchName.substring(0, 20)
//       : selectedBranchName.substring(0, 20);

//     const etaTime = getETATimeFormatForGTag();
//     const freeBuddy = `FRB${currentStatusZoneETPTrend.freeBuddies}`;

//     if (currentStatusZoneETPTrend.etpMoreThanConfigValue) {
//       eventName += `>15-${currentZoneId}${etaTime}`;
//       eventEmitter(eventName, 'eta-trend-more', eventName, 'eta-trend', 1);

//       const eventActions = `>15-${currentZoneId}${etaTime}${freeBuddy}`;
//       eventEmitter(
//         eventActions,
//         'eta-trend-more-free-buddy',
//         eventActions,
//         'eta-trend-free-buddy',
//         1
//       );
//     } else {
//       eventName += `<15-${currentZoneId}${etaTime}`;
//       eventEmitter(eventName, 'eta-trend-less', eventName, 'eta-trend', 1);

//       const eventActions = `<15-${currentZoneId}${etaTime}${freeBuddy}`;
//       eventEmitter(
//         eventActions,
//         'eta-trend-less-free-buddy',
//         eventActions,
//         'eta-trend-free-buddy',
//         1
//       );
//     }
//   }
// };

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
}

export interface SharedActions {
  readAppConstants: () => Promise<void>;
  verifyAppVersionUpdate: (apiVersion: string) => void;
  calculateTrendToShowETP: (zoneDetail: any, freeBuddies: any) => void;
  triggerCalculatedTrend: (zoneId: number, branchId: string) => void;
  setSuperSaverPromation: (
    vendorId: string,
    branchId: string,
    currencyCode: string
  ) => Promise<string[]>;
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
  getFleetZonePickUpTrend: () => Promise<void>;
  getAllFreeBuddiesOnLoad: () => Promise<void>;
}

export const useSharedStore = create<SharedState & SharedActions>()(
  persist(
    (set, get) => {
      // Private helper functions within the store's scope

      return {
        // Initial State
        surveyCount: 0,
        isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
        improvements: [],
        appConstants: null,
        rate: null,
        foodicsReference: null,
        foodicsCanceledMessage: false,
        foodicsAssociatedToVendorAdmin: false,
        isRateFirstOrderPickUp: false,
        whatsAppUpdateAddress: null,
        whatsAppUpdateAddressMessage: null,
        fleetZonePickUpTrend: [],
        freeDriverData: [],
        currentStatusZoneETPTrend: undefined,
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

        // Actions

        setValue: (key: keyof SharedState, value: any) => set({ [key]: value }),
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
          const country = environment.COUNTRY.toLowerCase();
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
          if (apiVersion.trim() !== environment.APP_VERSION) {
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

        setSuperSaverPromation: async (vendorId: string, branchId: string) => {
          try {
            const res: any = await getSuperSaverPromation(vendorId, branchId);
            return setSuperSaverWalletInfoMessage(res.data);
          } catch (err: any) {
            logError(err.message);
            return [];
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

        getFleetZonePickUpTrend: async () => {
          try {
            const res: any = await getFleetZonePickUpTrendAPINew();

            if (res.data) {
              res.data.forEach((element: any) => {
                element.system_response_at = new Date();
              });
              set({ fleetZonePickUpTrend: res.data });
              const { getLocalStorage } = get();
              const branchId =
                getLocalStorage(storageConstants.branch_id) || '';
              get().triggerCalculatedTrend(get().currentZoneId!, branchId);
            }
          } catch (err: any) {
            logError(err?.error?.message);
          }
        },

        getAllFreeBuddiesOnLoad: async () => {
          try {
            const res: any = await getAllFreeBuddiesFromB2C();
            if (res) {
              set({ freeDriverData: res });
              const { getLocalStorage } = get();
              const branchId =
                getLocalStorage(storageConstants.branch_id) || '';
              get().triggerCalculatedTrend(get().currentZoneId!, branchId);
            }
          } catch (err: any) {
            logError(err);
          }
        },

        triggerCalculatedTrend: async (zoneId: number, branchId: string) => {
          const {
            fleetZonePickUpTrend,
            freeDriverData,
            calculateTrendToShowETP,
            getFleetZonePickUpTrend,
            getAllFreeBuddiesOnLoad,
          } = get();

          if (!fleetZonePickUpTrend) {
            await getFleetZonePickUpTrend();
          }
          if (!freeDriverData) {
            await getAllFreeBuddiesOnLoad();
          }

          const zoneTrend = fleetZonePickUpTrend?.find(
            (x: any) => x.zone_region_id === zoneId
          );
          const freeBuddies = freeDriverData.find((x) => x.regionId === zoneId);
          calculateTrendToShowETP(zoneTrend, freeBuddies);
        },
      };
    },
    {
      name: 'shared-storage',
    }
  )
);
