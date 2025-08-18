import { apiFetch } from '@/shared/lib/utils';
import { configService } from '@/shared/services/app-config';

export const orderService = {
  createOnDemandOrders: (orders: any) =>
    apiFetch<any>(`${configService.orderServiceApiUrl()}/on-demand/create`, {
      method: 'POST',
      body: JSON.stringify(orders),
    }),

  createBulkOrders: (orders: any) =>
    apiFetch(`${configService.orderServiceApiUrl()}/bulk/create`, {
      method: 'POST',
      body: JSON.stringify(orders),
    }),

  dispatchBulkOrder: (request: any) =>
    apiFetch(
      `${configService.orderServiceApiUrl()}/rescheduled-bulk-order/dispatch-now`,
      { method: 'POST', body: JSON.stringify(request) }
    ),

  cancelBulkOrder: (request: any) =>
    apiFetch(
      `${configService.orderServiceApiUrl()}/rescheduled-bulk-order/cancel`,
      { method: 'POST', body: JSON.stringify(request) }
    ),

  updatePayment: (payment: any, orderUuid: string) =>
    apiFetch(
      `${configService.orderServiceApiUrl()}/update/${orderUuid}/payment`,
      { method: 'PUT', body: JSON.stringify(payment) }
    ),

  updateAddress: (address: any, orderUuid: string) =>
    apiFetch(
      `${configService.orderServiceApiUrl()}/update/${orderUuid}/drop-off`,
      { method: 'PUT', body: JSON.stringify(address) }
    ),

  getOrderList: (url: string) =>
    apiFetch(`${configService.orderServiceApiUrl()}${url}`),

  getOrderStatusById: (id: string) =>
    apiFetch(`${configService.orderServiceApiUrl()}/get-vendor-order/${id}`),

  calculateDeliveryEstimate: (req: any) =>
    apiFetch(
      `${configService.orderServiceApiUrl()}/pre-order/delivery-calculate`,
      { method: 'POST', body: JSON.stringify(req) }
    ),

  codLock: () =>
    apiFetch(`${configService.orderServiceApiUrl()}/payment/lock`, {
      method: 'POST',
      body: '',
    }),

  codUnLock: () =>
    apiFetch(`${configService.orderServiceApiUrl()}/payment/unlock`, {
      method: 'POST',
      body: '',
    }),

  codLockConfig: () =>
    apiFetch(`${configService.orderServiceApiUrl()}/payment/lock-config`),

  syncOrder: (order: any) =>
    apiFetch(`${configService.orderServiceApiUrl()}/status/sync`, {
      method: 'POST',
      body: JSON.stringify(order),
    }),

  getOrderInfo: (orderNumber: string) =>
    apiFetch(
      `${configService.orderServiceApiUrl()}/get-order-info/${orderNumber}`
    ),
};
