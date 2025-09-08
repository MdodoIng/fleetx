import { environment } from '@/environments/environment';
import { apiFetch } from '../lib/utils';
import { typePostRating, TypeRootRatingResponse } from '../types/rating';
import { configService } from './app-config';
import { useSharedStore } from '@/store';
import { AuthData, DecodedToken } from '../types/auth';
import {
  commonConstants,
  storageConstants,
} from '../constants/storageConstants';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import { Locale, useTranslations } from 'next-intl';
import { setUserLocale } from './locale';
import { ErrorMessages } from '../constants/commonMessages';
import { TypeCheckBlockActivationRes } from '../types/services';
import {
  TypeFirstOrderInsightResponse,
  TypeSuperSaverPromationRes,
} from '../types/index,d';

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

export const getDeliveryRate = (
  orderNumber: string
): Promise<TypeRootRatingResponse> =>
  apiFetch(
    configService.rateServiceApiUrl() + '/order/delivery/' + orderNumber,
    {
      method: 'GET',
    }
  );

export const setDeliveryRate = (request: typePostRating) =>
  apiFetch(configService.rateServiceApiUrl() + '/order/delivery/rate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
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

export const getSuperSaverPromation = (
  vendorId: string,
  branchId: string
): Promise<TypeSuperSaverPromationRes> =>
  apiFetch(
    configService.finServiceApiUrl() +
      '/super-saver-promotion-status/vendor/' +
      vendorId +
      '/branch/' +
      branchId
  );

export const getFirstOrderInsight = (
  fromDate: Date | null,
  toDate: Date | null
): Promise<TypeFirstOrderInsightResponse> => {
  const { getFormattedDate } = useSharedStore.getState();
  let url = '/first-order/insight';
  url = fromDate ? url + '?from_date=' + getFormattedDate(fromDate) : url;
  url = toDate ? url + '&to_date=' + getFormattedDate(toDate) : url;
  return apiFetch(configService.rateServiceApiUrl() + url, {
    method: 'GET',
  });
};

export const getFirstOrderList = (
  page: number,
  perPage: number,
  fromDate: Date | null,
  toDate: Date | null
) => {
  const { getFormattedDate } = useSharedStore.getState();
  let url = '/first-orders/list?page_size=' + perPage + '&page=' + page;
  url = fromDate ? url + '&from_date=' + getFormattedDate(fromDate) : url;
  url = toDate ? url + '&to_date=' + getFormattedDate(toDate) : url;
  return apiFetch(configService.rateServiceApiUrl() + url);
};
export const getFirstOrderPickUpRate = (value: any) =>
  apiFetch(
    configService.rateServiceApiUrl() + '/first/order/pickup/rating/' + value
  );

export const checkBlockActivation = (
  vendorId: string,
  branchId?: string
): Promise<TypeCheckBlockActivationRes> => {
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
export const toValidateOperationalHours = () => {
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

export const checkZoneBusyModeIsEnabled = () => {
  const { activeBusyModeDetails } = useSharedStore();
  if (!activeBusyModeDetails) return false;
  const now = new Date();
  const activatedAt = new Date(activeBusyModeDetails.activated_at);
  const expiredAt = new Date(activeBusyModeDetails.expired_at);
  return now > activatedAt && now < expiredAt;
};

export const getDiffrenceBwCurrentAndLastUpdatedETP = (zoneDetail: any) => {
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

export const setSuperSaverWalletInfoMessage = (data: any) => {
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
