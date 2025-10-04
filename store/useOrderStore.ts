import {
  DeliverySummary,
  OrderStatus,
  TypeDelivery,
  TypeDropOffs,
  TypeEstimatedDelivery,
  TypeEstimatedDeliveryReturnFromApi,
  TypeLiveOrderItem,
  TypeOrderHistoryList,
  TypeOrderList,
  TypePickUp,
  TypeRootLiveOrderList,
} from '@/shared/types/orders';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSharedStore } from './useSharedStore';
import { getDecodedAccessToken } from '@/shared/services';
import { vendorService } from '@/shared/services/vendor';

interface OrderState {
  dropOffs: TypeDropOffs[];
  pickUp: TypePickUp | undefined;
  estimatedDelivery: TypeEstimatedDelivery | undefined;
  deliveryModel: (typeof TypeDelivery)[number];
  selectedDropOffs: TypeDropOffs[];
  selectedPage: number;
  selectedPerPage: number;
  orderStatusListData: TypeOrderHistoryList[] | undefined;
  totalCountList: number;
  estimatedDeliveryReturnFromApi:
    | TypeEstimatedDeliveryReturnFromApi
    | undefined;
  deliverySummary: DeliverySummary | null;
  orderHistoryListData: TypeOrderHistoryList[] | undefined;
  OLDER_DATE: string;
  isEditDetails: boolean;
  selectedAffiliator: any;
  //
  // actions
  updateDeliveryModel: (deliveryModel: number) => void;
  setEstimatedDeliveryReturnFromApi: (
    data: TypeEstimatedDeliveryReturnFromApi
  ) => void;

  setSourceForTable: (
    key: 'orderStatusListData' | 'orderHistoryListData',
    data: TypeLiveOrderItem[],
    clearData?: boolean
  ) => TypeOrderHistoryList[];
  clearAll: () => unknown;
  setValue: <K extends keyof OrderState>(key: K, value: OrderState[K]) => void;
}

const initialState = {
  dropOffs: [],
  selectedDropOffs: [],
  selectedPage: 1,
  selectedPerPage: 10,
  orderStatusListData: undefined,
  totalCountList: 0,
  pickUp: undefined,
  estimatedDelivery: undefined,
  deliveryModel: TypeDelivery[0],
  estimatedDeliveryReturnFromApi: undefined,
  deliverySummary: null,
  orderHistoryListData: undefined,
  OLDER_DATE: '2023-01-01',
  isEditDetails: false,
  selectedAffiliator: null,
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setValue(key, value) {
        set({ [key]: value });
      },
      clearAll: () => set({ ...initialState }),
      updateDeliveryModel: (deliveryModel: number) => {
        const delivery = TypeDelivery.find((x) => x.key === deliveryModel);
        set({ deliveryModel: delivery ? delivery : TypeDelivery[0] });
      },

      setEstimatedDeliveryReturnFromApi: (data) => {
        const { appConstants } = useSharedStore.getState();

        let totalOrders = data?.drop_offs?.length || 0;
        let totalKMs = 0;
        let totalDeliveryFee = 0;
        let estTime = 0;

        const delivery = TypeDelivery.find(
          (x) => x.key === data?.delivery_model
        );
        const deliveryModel = delivery?.value || '';

        data?.drop_offs?.forEach((element) => {
          totalDeliveryFee += element.delivery_fee || 0;
          totalKMs += element.delivery_distance || 0;
          estTime = element.delivery_duration;
        });

        const summary: DeliverySummary = {
          totalOrders,
          totalDelivery: `${totalDeliveryFee.toFixed(2)} ${appConstants?.currency}`,
          totalKM: `${totalKMs.toFixed(2)} KM`,
          deliveryModel,
          estTime,
        };

        set({
          estimatedDeliveryReturnFromApi: data,
          deliverySummary: summary,
        });
      },

      setSourceForTable(key, data, clearData = false) {
        if (clearData) {
          set({
            orderHistoryListData: undefined,
          });
        }

        const { isEditDetails } = get();
        const orderList: TypeOrderHistoryList[] = [];
        if (data) {
          data.forEach((element) => {
            const order: TypeOrderHistoryList = {} as TypeOrderHistoryList;
            Object.entries(element).forEach(([key, item]) => {
              order[key] = item;
            });
            order.id = element.id;

            order.branch_id = element.branch_id;
            order.vendor_id = element.vendor_id;
            order.order_number = element.vendor_order_id
              ? element.vendor_order_id
              : 'screens.orderList.noData';
            order.fleetx_order_number = element.order_number;
            order.customer_name = element.customer_name;
            order.phone_number = element.mobile_number;
            order.customer_name_sender = element.pick_up.customer_name;
            order.phone_number_sender = element.pick_up.mobile_number;
            order.primary_status = element.primary_status;
            order.delivery_duration = Number(element.delivery_duration).toFixed(
              0
            );

            const statusObj = OrderStatus.find(
              (x) => x.key === element.primary_status
            );

            order.status = statusObj ? statusObj.value : '';

            const status = statusObj ? statusObj.color : '';
            order.class_status = status.replace(' ', '_');

            order.from = element.pick_up.address
              ? element.pick_up.address
              : element.pick_up.area;
            order.to = element.drop_off.address
              ? element.drop_off.address
              : element.drop_off.area +
                ', ' +
                element.drop_off.block +
                ', ' +
                element.drop_off.street;
            order.creation_date = new Date(element.created_at).toLocaleString();
            order.amount_collected = element.amount_to_collect;
            if (element.delivery_distance) {
              const distance = parseFloat(element.delivery_distance).toFixed(2);
              order.delivery_distance = distance.toString();
            }
            order.delivery_fee = element.delivery_fee;
            if (element.fulfill) {
              order.driver_name = element.fulfill.driver_name
                ? element.fulfill.driver_name
                : 'screens.orderList.noData';
              order.driver_phone = element.fulfill.driver_phone
                ? element.fulfill.driver_phone
                : 'screens.orderList.noData';
              order.delivered_date = element.fulfill.completed_at!;
              order.canceled_at = element.fulfill.canceled_at!;
            } else {
              order.driver_name = '';
              order.driver_phone = '';
            }

            if (order.primary_status === 120) {
              order.delivery_model = '';
            } else if (element.delivery_model === 0) {
              order.delivery_model = '';
            } else {
              const delivery = TypeDelivery.find(
                (x) => x.key === element.delivery_model
              );
              order.delivery_model = delivery ? delivery.value : '';
            }

            order.is_delivery_address_edit_enabled =
              checkDeliveryAddressEditIsEnabled(element);
            order.payment_type = element.payment_type;
            order.drop_off = element.drop_off;

            order.status_change_reason = element.status_change_reason
              ? element.status_change_reason.reason
              : undefined;
            order.is_addr_last_updated_by_customer = element.updated_address
              ? element.updated_address.is_addr_last_updated_by_customer
              : undefined;
            order.isSyncShow = isSyncButtonShow(element);

            order.isOlderData = isEditDetails
              ? isCreatedDateIsTooOlder(element.created_at)
              : true;
            orderList.push(order);
            vendorService
              .getBranchDetailByBranchId({
                vendor_id: element.vendor_id!,
                branch_id: element.branch_id!,
              })
              .then((res) => {
                order.branch_name = res.data.main_branch
                  ? 'Main Branch ' + res.data.name
                  : 'Branch ' + res.data.name;
              });
          });
        }

        set({
          [key]: orderList,
        });
        return orderList;
      },
    }),

    {
      name: 'order-store',
    }
  )
);

function checkDeliveryAddressEditIsEnabled(event: TypeLiveOrderItem): boolean {
  const orderStatus = OrderStatus.find((x) => x.key === event.primary_status);
  const currentUser = getDecodedAccessToken();
  if (currentUser) {
    switch (currentUser.roles[0]) {
      case 'OPERATION_MANAGER':
      case 'VENDOR_ACCOUNT_MANAGER':
      case 'SALES_HEAD':
        if (
          orderStatus?.value == 'orderStatus.DELIVERED.default' &&
          event.fulfill?.completed_at &&
          Date.now() - +new Date(event.fulfill.completed_at) <
            24 * 60 * 60 * 1000
        ) {
          return true;
        }
        return false;

      case 'FINANCE_MANAGER':
        if (isCreatedDateIsTooOlder(event.created_at)) {
          return false;
        }
        return true;

      case 'VENDOR_USER':
        return false;
    }
  }
  return false;
}

function isCreatedDateIsTooOlder(createdAt: string) {
  const createdDate = new Date(createdAt);
  const { OLDER_DATE } = useOrderStore.getState();
  const januaryFirst2023 = new Date(OLDER_DATE);
  return createdDate < januaryFirst2023;
}

function isSyncButtonShow(element: TypeLiveOrderItem) {
  const createdAt = new Date(element.created_at);
  const currentDatetime = new Date(); // Current datetime

  // Calculate the difference in milliseconds
  const diffInMilliseconds = currentDatetime.getTime() - createdAt.getTime();

  // Calculate the difference in days and minutes
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

  // Check if the difference is exactly 30 days and 1 minute
  if (diffInDays <= 30 && diffInMinutes >= 1) {
    return true;
  } else {
    if (
      element.primary_status !== 120 &&
      element.primary_status !== 110 &&
      diffInDays > 30
    ) {
      return true;
    } else {
      return false;
    }
  }
}
