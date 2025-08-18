import { configService } from "@/shared/services/app-config";
import {
  Orders,
  UpdatePayment,
  UpdateAddress,
  EstimatedDeliveryModel,
} from "@/shared/types/orders";

async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export const orderService = {
  createOnDemandOrders: (orders: Orders) =>
    http<any>(`${configService.orderServiceApiUrl()}/on-demand/create`, {
      method: "POST",
      body: JSON.stringify(orders),
    }),

  createBulkOrders: (orders: Orders) =>
    http<any>(`${configService.orderServiceApiUrl()}/bulk/create`, {
      method: "POST",
      body: JSON.stringify(orders),
    }),

  dispatchBulkOrder: (request: any) =>
    http<any>(
      `${configService.orderServiceApiUrl()}/rescheduled-bulk-order/dispatch-now`,
      { method: "POST", body: JSON.stringify(request) }
    ),

  cancelBulkOrder: (request: any) =>
    http<any>(
      `${configService.orderServiceApiUrl()}/rescheduled-bulk-order/cancel`,
      { method: "POST", body: JSON.stringify(request) }
    ),

  updatePayment: (payment: UpdatePayment, orderUuid: string) =>
    http<any>(
      `${configService.orderServiceApiUrl()}/update/${orderUuid}/payment`,
      { method: "PUT", body: JSON.stringify(payment) }
    ),

  updateAddress: (address: UpdateAddress, orderUuid: string) =>
    http<any>(
      `${configService.orderServiceApiUrl()}/update/${orderUuid}/drop-off`,
      { method: "PUT", body: JSON.stringify(address) }
    ),

  getOrderList: (url: string) =>
    http<any>(`${configService.orderServiceApiUrl()}${url}`),

  getOrderStatusById: (id: string) =>
    http<any>(`${configService.orderServiceApiUrl()}/get-vendor-order/${id}`),

  calculateDeliveryEstimate: (req: EstimatedDeliveryModel) =>
    http<any>(
      `${configService.orderServiceApiUrl()}/pre-order/delivery-calculate`,
      { method: "POST", body: JSON.stringify(req) }
    ),

  codLock: () =>
    http<any>(`${configService.orderServiceApiUrl()}/payment/lock`, {
      method: "POST",
      body: "",
    }),

  codUnLock: () =>
    http<any>(`${configService.orderServiceApiUrl()}/payment/unlock`, {
      method: "POST",
      body: "",
    }),

  codLockConfig: () =>
    http<any>(`${configService.orderServiceApiUrl()}/payment/lock-config`),

  syncOrder: (order: any) =>
    http<any>(`${configService.orderServiceApiUrl()}/status/sync`, {
      method: "POST",
      body: JSON.stringify(order),
    }),

  getOrderInfo: (orderNumber: string) =>
    http<any>(
      `${configService.orderServiceApiUrl()}/get-order-info/${orderNumber}`
    ),
};
