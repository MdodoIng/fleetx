import { useAuthStore, useVenderStore } from '@/store';
import { apiFetch } from '../lib/utils';
import { appConfig } from './app-config';
import {
  TypeGetWarningMessageApiResponse,
  TypeNotificationsResponse,
  TypeOperationTimeApiResponse,
} from '../types/notification';

export const notificationService = {
  getNotification(url: string): Promise<TypeNotificationsResponse> {
    return apiFetch(appConfig.notificationServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  getWarningMessageApi(): Promise<TypeGetWarningMessageApiResponse> {
    return apiFetch(appConfig.orderServiceApiUrl() + '/order-screen-msg/get', {
      method: 'GET',
    });
  },

  getNotificationHistoryUrl(
    perPage: number,
    notifyAt: string | null,
    id: string | null
  ) {
    let url = '/list?page_size=' + perPage;
    url = id ? url + '&id=' + id : url;
    url = notifyAt ? url + '&notify_at=' + notifyAt : url;
    return this.getVenodrBarnchUrl(url);
  },

  getVenodrBarnchUrl(url: string) {
    const { user } = useAuthStore.getState();
    const { vendorId, branchId } = useVenderStore.getState();
    switch (user?.roles[0]) {
      case 'OPERATION_MANAGER':
      case 'VENDOR_ACCOUNT_MANAGER':
      case 'SALES_HEAD':
        if (vendorId) {
          url = url + '&vendor_id=' + vendorId;
          if (branchId) {
            url = url + '&branch_id=' + branchId;
          }
        }
        break;
      case 'FINANCE_MANAGER':
        if (vendorId) {
          url = url + '&vendor_id=' + vendorId;
          if (branchId) {
            url = url + '&branch_id=' + branchId;
          }
        }
        break;
      case 'VENDOR_USER':
        if (!user.user.vendor?.branch_id) {
          if (branchId) {
            url = url + '&branch_id=' + branchId;
          }
        }
        break;
    }
    return url;
  },

  getOperationTimeApi(): Promise<TypeOperationTimeApiResponse> {
    return apiFetch(
      appConfig.orderServiceApiUrl() + '/config/operation/timing/get',
      {
        method: 'GET',
      }
    );
  },

  getBusyModeApi(): Promise<any> {
    return apiFetch(
      appConfig.orderServiceApiUrl() + '/config/busy-mode/status',
      {
        method: 'GET',
      }
    );
  },
};
