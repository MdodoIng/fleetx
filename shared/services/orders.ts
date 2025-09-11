import { apiFetch } from '@/shared/lib/utils';
import { getDecodedAccessToken } from '@/shared/services';
import { appConfig } from '@/shared/services/app-config';
import {
  TypeEstimatedDelivery,
  TypeEstimatedDeliveryReturnFromApi,
  TypeOrders,
  TypeRootEstimatedDeliveryReturnFromApi,
  TypeRootLiveOrderList,
  TypeRootOrderStatusHistoryHistory,
  TypeUpdateAddressReq,
  TypeUpdateAddressResponce,
  TypeUpdatePaymentReq,
  TypeZoneResponce,
} from '@/shared/types/orders';
import { useAuthStore, useVenderStore } from '@/store';
import { useSharedStore } from '@/store/sharedStore';

export const orderService = {
  createOnDemandOrders: (orders: TypeOrders) =>
    apiFetch<any>(`${appConfig.orderServiceApiUrl()}/on-demand/create`, {
      method: 'POST',
      body: JSON.stringify(orders),
    }),

  createBulkOrders: (orders: any) =>
    apiFetch(`${appConfig.orderServiceApiUrl()}/bulk/create`, {
      method: 'POST',
      body: JSON.stringify(orders),
    }),

  dispatchBulkOrder: (request: any) =>
    apiFetch(
      `${appConfig.orderServiceApiUrl()}/rescheduled-bulk-order/dispatch-now`,
      { method: 'POST', body: JSON.stringify(request) }
    ),

  cancelBulkOrder: (request: any) =>
    apiFetch(
      `${appConfig.orderServiceApiUrl()}/rescheduled-bulk-order/cancel`,
      { method: 'POST', body: JSON.stringify(request) }
    ),

  updatePayment: (payment: TypeUpdatePaymentReq, orderUuid: string) =>
    apiFetch(
      `${appConfig.orderServiceApiUrl()}/update/${orderUuid}/payment`,
      { method: 'PUT', body: JSON.stringify(payment) }
    ),

  updateAddress: (
    address: TypeUpdateAddressReq,
    orderUuid: string
  ): Promise<TypeUpdateAddressResponce> =>
    apiFetch(
      `${appConfig.orderServiceApiUrl()}/update/${orderUuid}/drop-off`,
      { method: 'PUT', body: JSON.stringify(address) }
    ),

  getOrderList: (url: string): Promise<TypeRootLiveOrderList> =>
    apiFetch(`${appConfig.orderServiceApiUrl()}${url}`),

  getOrderStatusUrl(
    page: number,
    perPage: number,
    searchOrder?: string,
    searchCustomer?: string,
    searchDriver?: string | number,
    searchAll: boolean | null = true
  ) {
    let url: string = '/active-list?page=' + page + '&page_size=' + perPage;
    const currentUser = getDecodedAccessToken();
    const { branchId, vendorId } = useVenderStore.getState();
    const { user } = useAuthStore.getState();

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
    if (searchOrder) {
      url = url + '&order_number=' + searchOrder;
    }
    if (searchCustomer) {
      url = url + '&search=' + searchCustomer;
    }
    if (searchDriver) {
      url = url + '&driver_id=' + searchDriver;
    }
    if (searchAll != null) {
      url = url + '&search_all=' + searchAll;
    }
    return url;
  },

  getOrderHistoryUrl(
    perPage: number,
    fromDate?: Date,
    toDate?: Date,
    searchOrder?: string,
    searchCustomer?: string,
    searchDriver?: string,
    searchAll: boolean | null = true,
    nextSetItemTotal?: string[],
    selectedAccountManager?: string,
    sortField?: string
  ) {
    let url: string = '/list?page_size=' + perPage;
    if (fromDate) {
      const from = fromDate ? this.getFormattedDate(fromDate) : '';
      url = url + '&from_date=' + from;
    }
    if (toDate) {
      const to = toDate ? this.getFormattedDate(toDate) : '';
      url = url + '&to_date=' + to;
    }
    if (selectedAccountManager) {
      url = url + '&account_manager_id=' + selectedAccountManager;
    }
    if (sortField) {
      url = url + '&sort_field=' + sortField;
    }
    nextSetItemTotal?.forEach((element) => {
      url = url + '&NEXT_SET_ITEMS_TOKEN=' + element;
    });
    return this.getOrderStatusCommonUrl(
      url,
      searchOrder,
      searchCustomer,
      searchDriver,
      searchAll
    );
  },

  getOrderStatusCommonUrl(
    url: string,
    searchOrder?: string,
    searchCustomer?: string,
    searchDriver?: string,
    searchAll: boolean | null = true
  ) {
    const currentUser = getDecodedAccessToken();
    const { vendorId, branchId } = useVenderStore.getState();
    switch (currentUser?.roles[0]) {
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
        if (!currentUser.user.vendor?.branch_id) {
          if (branchId) {
            url = url + '&branch_id=' + branchId;
          }
        }
        break;
    }
    if (searchOrder) {
      url = url + '&order_number=' + searchOrder;
    }
    if (searchCustomer) {
      url = url + '&search=' + searchCustomer;
    }
    if (searchDriver) {
      url = url + '&driver_id=' + searchDriver;
    }
    if (searchAll != null) {
      url = url + '&search_all=' + searchAll;
    }
    return url;
  },

  getOrderStatusById: (
    id: string
  ): Promise<TypeRootOrderStatusHistoryHistory> =>
    apiFetch(`${appConfig.orderServiceApiUrl()}/get-vendor-order/${id}`, {
      method: 'GET',
    }),

  calculateDeliveryEstimate: (
    req: TypeEstimatedDelivery
  ): Promise<TypeRootEstimatedDeliveryReturnFromApi> =>
    apiFetch(
      `${appConfig.orderServiceApiUrl()}/pre-order/delivery-calculate`,
      { method: 'POST', body: JSON.stringify(req) }
    ),

  codLock: () =>
    apiFetch(`${appConfig.orderServiceApiUrl()}/payment/lock`, {
      method: 'POST',
      body: '',
    }),

  codUnLock: () =>
    apiFetch(`${appConfig.orderServiceApiUrl()}/payment/unlock`, {
      method: 'POST',
      body: '',
    }),

  codLockConfig: () =>
    apiFetch(`${appConfig.orderServiceApiUrl()}/payment/lock-config`),

  syncOrder: (order: any) =>
    apiFetch(`${appConfig.orderServiceApiUrl()}/status/sync`, {
      method: 'POST',
      body: JSON.stringify(order),
    }),

  getOrderInfo: (orderNumber: string) =>
    apiFetch(
      `${appConfig.orderServiceApiUrl()}/get-order-info/${orderNumber}`
    ),

  getFormattedDate(date: Date) {
    return (
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2)
    );
  },

  getZone(): Promise<TypeZoneResponce> {
    return apiFetch(`${appConfig.orderServiceApiUrl()}/zone/list`, {
      method: 'GET',
    });
  },
};
