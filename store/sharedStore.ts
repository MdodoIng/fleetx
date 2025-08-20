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
import { useStorageStore } from './useStorageStore';
import { AuthData, DecodedToken } from '@/shared/types/auth';
import { useTranslations, Locale } from 'next-intl';

type ToastStatus = 'success' | 'info' | 'warning' | 'error' | 'default';

interface SharedState {
  surveyCount: number;
  isOnline: boolean;
  smsPathURL?: string;
  resetPasswordPathUrl?: string;
  currentRates?: number;
  orderNumberRate?: string;
  improvements: any[];
  appConstants: typeof kuwait | typeof bahrain | typeof qatar | null;
  rate: number | null;
  branchId: any | null;
  vendorId: any | null;
  foodicsReference: string | null;
  foodicsIsAlreadyConnected?: boolean;
  foodicsCanceledMessage: boolean;
  foodicsAssociatedToVendorAdmin: boolean;
  isRateFirstOrderPickUp: boolean;
  whatsAppUpdateAddress: any;
  whatsAppUpdateAddressMessage: any;
  fleetZonePickUpTrend: any[];
  freeDriverData: any[];
  currentStatusZoneETPTrend: undefined;
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

interface SharedActions {
  readAppConstants: () => Promise<void>;
  verifyAppVersionUpdate: (apiVersion: string) => void;
  calculateTrendToShowETP: (zoneDetail: any, freeBuddies: any) => void;
  triggerCalculatedTrend: (zoneId: number) => void;
  setSuperSaverPromation: (
    vendorId: string,
    branchId: string,
    currencyCode: string
  ) => Promise<string[]>;
  // Add other actions that modify state here
  setState: (partialState: Partial<SharedState>) => void;
}

export const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    // In a real app, you'd have more robust error handling
    const errorBody = await res
      .json()
      .catch(() => ({ message: res.statusText }));
    throw new Error(errorBody.message || 'An API error occurred');
  }
  return res.json();
};

export const getArea = () =>
  fetcher(environment.API_GATEWAY_BASE_URL + '/locs/areas');
export const getAreaByPickupAreaId = (id: string) =>
  fetcher(
    environment.API_GATEWAY_BASE_URL + '/locs/allowed/drop-off/areas/' + id
  );
export const getBlock = (id: string) =>
  fetcher(environment.API_GATEWAY_BASE_URL + '/locs/areas/' + id + '/blocks');
export const getStreet = (id: string) =>
  fetcher(environment.API_GATEWAY_BASE_URL + '/locs/blocks/' + id + '/streets');
export const getBuildings = (id: string) =>
  fetcher(
    environment.API_GATEWAY_BASE_URL + '/locs/streets/' + id + '/buildings'
  );

export const getDeliveryRate = (request: any) =>
  fetcher(+'/order/delivery/' + request);
export const getCurrentIPInfo = () => fetcher('http://ipinfo.io/json'); // Note: client-side only
export const getCurrentIPWhois = () =>
  fetcher('https://ipwhois.app/json/?lang=en'); // Note: client-side only
export const connectFoodics = () =>
  fetcher(configService.userServiceApiUrl() + '/foodics/connect');
export const associateFoodics = (request: any) =>
  fetcher(configService.vendorServiceApiUrl() + '/foodics/branch/associate', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
export const validateVerifyCustomerAddress = (request: string) =>
  fetcher(
    configService.orderServiceApiUrl() + '/validate/customer/address/' + request
  );
export const verifyCustomerAddress = (request: any) =>
  fetcher(configService.orderServiceApiUrl() + '/verify/customer/address', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });

export const getAllFreeBuddiesFromB2C = () =>
  fetcher(environment.B2C_BASE_URL + 'zoningPushZoneMetric');
export const getSuperSaverPromation = (vendorId: string, branchId: string) =>
  fetcher(
    configService.finServiceApiUrl() +
      '/super-saver-promotion-status/vendor/' +
      vendorId +
      '/branch/' +
      branchId
  );

export const getFirstOrderInsight = (fromDate: Date, toDate: Date) => {
  const { getFormattedDate } = useStorageStore();
  const params = new URLSearchParams({
    from_date: getFormattedDate(fromDate),
    to_date: getFormattedDate(toDate),
  });
  return fetcher(
    configService.rateServiceApiUrl() +
      `/first-order/insight?${params.toString()}`
  );
};
export const getFirstOrderList = (url: string) =>
  fetcher(configService.rateServiceApiUrl() + url);
export const getFirstOrderPickUpRate = (value: any) =>
  fetcher(
    configService.rateServiceApiUrl() + '/first/order/pickup/rating/' + value
  );

export const checkBlockActivation = (vendorId: string, branchId?: string) => {
  const url = branchId ? `${vendorId}/${branchId}` : vendorId;
  return fetcher(
    configService.finServiceApiUrl() + '/wallet/recharge/blocked/' + url
  );
};

export const getZone = (request: any) =>
  fetcher(configService.orderServiceApiUrl() + '/pickup/address/zone', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
export const getFleetZonePickUpTrendAPI = () =>
  fetcher(configService.fleetServiceApiUrl() + '/zone-pickup/trend');
export const getFleetZonePickUpTrendAPINew = () =>
  fetcher(configService.awsApiGatewayBaseUrl() + '/zone/pickup-agg-data');
export const getBulkOrderDetails = (encryptedOrderNo: string) =>
  fetcher(
    configService.orderServiceApiUrl() +
      '/get-customer-bulk-order/' +
      encryptedOrderNo
  );

export const getCurrentUser = (): AuthData | undefined => {
  const { getLocalStorage } = useStorageStore();
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
  const { getLocalStorage } = useStorageStore();
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

export const useSharedStore = create<SharedState & SharedActions>()((
  set,
  get
) => {
  // Private helper functions within the store's scope
  const toValidateOperationalHours = () => {
    const { operationalHours } = get();
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
    const { activeBusyModeDetails } = get();
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

  return {
    // Initial State
    surveyCount: 0,
    isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
    improvements: [],
    appConstants: null,
    rate: null,
    branchId: null,
    vendorId: null,
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

    // Actions
    setState: (partialState) => set(partialState),
    setFoodicsIsAlreadyConnected: (isConnected: boolean) =>
      set({ foodicsIsAlreadyConnected: isConnected }),

    readAppConstants: async () => {
      const country = environment.COUNTRY.toLowerCase();
      let appConstants = null;

      if (country === KUWAIT) {
        appConstants = kuwait;
      } else if (country === BAHRAIN) {
        appConstants = bahrain;
      } else if (country === QATAR) {
        appConstants = qatar;
      }

      set({ appConstants: appConstants });
    },

    verifyAppVersionUpdate: (apiVersion: string) => {
      const { getLocalStorage, addLocalStorage, removeLocalStorage } =
        useStorageStore();
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

    setSuperSaverPromation: async (vendorId, branchId) => {
      try {
        const res = await getSuperSaverPromation(vendorId, branchId);
        return setSuperSaverWalletInfoMessage(res.data);
      } catch (err: any) {
        logError(err.message);
        return [];
      }
    },

    calculateTrendToShowETP: (zoneDetail, freeBuddies) => {
      const { getLocalStorage } = useStorageStore();
      const branchId = getLocalStorage(storageConstants.branch_id);
      if (
        !toValidateOperationalHours() ||
        !freeBuddies ||
        !zoneDetail ||
        checkZoneBusyModeIsEnabled() ||
        !branchId
      ) {
        set({ currentStatusZoneETPTrend: undefined });
        return;
      }

      const newTrend: any = {};

      const freeDrivers = freeBuddies?.freeBuddies ?? 0;
      const unAssignedDrivers = freeBuddies?.unAssignedOrders ?? 0;
      const currentBuddies = freeDrivers - unAssignedDrivers;

      newTrend.freeBuddies = currentBuddies;
      newTrend.isEnable = zoneDetail?.need_ui_display;
      newTrend.avgPromisedETP = Math.round(zoneDetail.avg_pickup_duration / 60);

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

    triggerCalculatedTrend: (zoneId) => {
      const { fleetZonePickUpTrend, freeDriverData, calculateTrendToShowETP } =
        get();
      const zoneTrend = fleetZonePickUpTrend.find(
        (x) => x.zone_region_id === zoneId
      );
      const freeBuddies = freeDriverData.find((x) => x.regionId === zoneId);
      calculateTrendToShowETP(zoneTrend, freeBuddies);
    },
  };
});
