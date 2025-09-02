export type TypePickUp = {
  address: string;
  customer_name: string;
  paci_number: string;
  area: string;
  area_id: number;
  block: string;
  block_id: number;
  street: string;
  street_id: number;
  building: string;
  building_id: number;
  floor: string;
  room_number: string;
  landmark: string;
  mobile_number: string;
  latitude: string;
  longitude: string;
};

export type TypeDropOffs = {
  id: number;
  order_index: number | any;
  display_address: string;
  address: string;
  vendor_order_id: string;
  customer_name: string;
  paci_number: string;
  area: string;
  area_id: number;
  block: string;
  block_id: number;
  street: string;
  street_id: number;
  building_id: number;
  building: string;
  floor: string;
  room_number: string;
  landmark: string;
  mobile_number: string;
  latitude: string;
  longitude: string;
  specific_driver_instructions: string;
  quantity: number;
  amount_to_collect: number;
  payment_type: number;
};

export type TypeDropOffsDelivery = TypeDropOffs & {
  delivery_distance: number;
  delivery_fee: number;
  delivery_duration: number;
};

export type TypeEstimatedDelivery = {
  vendor_id: string;
  branch_id: string;
  delivery_model: number;
  pickup: TypePickUp;
  drop_offs: TypeDropOffs[];
  order_session_id: string | null;
};

export type TypeRootEstimatedDeliveryReturnFromApi = {
  data: TypeEstimatedDeliveryReturnFromApi;
};

export type TypeEstimatedDeliveryReturnFromApi = {
  vendor_id: string;
  branch_id: string;
  delivery_model: number;
  pickup: TypePickUp;
  drop_offs: TypeDropOffsDelivery[];
  order_session_id: string | null;
};

export type TypeOrderList = {
  id: string;
  order_number: string;
  created_at: string;
  fleetx_order_number: string;
  customer_name: string;
  phone_number: string;
  display_phone_number: string;
  customer_name_sender: string;
  phone_number_sender: string;
  display_phone_number_sender: string;
  from: string;
  to: string;
  to_address: string;
  from_address: string;
  driver_name: string;
  driver_phone: string;
  display_driver_phone: string;
  driver_id: number;
  driver_avatar: string;
  status: string;
  statusCode: number;
  primary_status: number;
  tracking_link: string;
  payment_type: string;
  amount_collected: string;
  drop_off: TypeDropOffs;
  pick_up: TypePickUp;
  delivered_date: string;
  canceled_at: string;
  vendor_name: string;
  branch_name: string;
  counter_barcode: string;
  cod_counter_type: number;
  class_status: string;
  fresh_chat_restore_id: string;
  unread_chat: boolean;
  oms_agent_id: string;
  is_addr_last_updated_by_customer: boolean;
  is_active_card: boolean;
  delivery_duration: string;
  disply_current_delivery_duration: string;
};

export type TypeOrderHistoryList = TypeLiveOrderItem & {
  id: string;
  order_number: string;
  fleetx_order_number: string;
  customer_name: string;
  phone_number: string;
  customer_name_sender: string;
  phone_number_sender: string;
  status: string;
  primary_status: number;
  from: string;
  to: string;
  delivered_date: string;
  canceled_at: string;
  driver_name: string;
  driver_phone: string;
  amount_collected: string;
  creation_date: string;
  payment_type: number;
  drop_off: TypeLiveOrderDropOff;
  pick_up: TypePickUp;
  delivery_distance: string;
  delivery_fee: string;
  delivery_model: string;
  delivery_duration: string;
  vendor_name: string;
  branch_name: string;
  class_status: string;
  status_change_reason: string | undefined;
  is_addr_last_updated_by_customer?: string | undefined;
  is_delivery_address_edit_enabled: boolean;
  branch_id: string;
  vendor_id: string;
  isSyncShow: boolean;
  isOlderData: boolean;
  primary_order_status?: any;
};

export interface TypeOrders {
  vendor_id: string;
  branch_id: string;
  driver_id: number;
  order_session_id: string;
  payment_type: number;
  order_meta: {
    vendor_name: string;
    ot_trend: string;
    ot_free_drivers: number;
  };
  pick_up: TypePickUp;
  drop_offs: TypeDropOffs[];
}

export interface TypeZoneETPTrend {
  etpMins: number;
  etpMoreThanConfigValue: boolean;
  avgPromisedETP: number;
  isEnable: boolean;
  freeBuddies: number;
}

export type TypeLiveOrderMeta = {
  branch_name: string;
  vendor_name: string;
  vendor_official_name: string;
};

export type TypeLiveOrderPickup = {
  area: string;
  block: string;
  street: string;
  area_id: number;
  block_id: number;
  landmark: string;
  latitude: string;
  longitude: string;
  street_id: number;
  paci_number: string;
  customer_name: string;
  mobile_number: string;
  address?: string;
};

export type TypeLiveOrderDropOff = {
  area: string;
  block: string;
  floor: string;
  street: string;
  area_id: number;
  block_id: number;
  building_id?: number;
  building?: string;
  landmark: string;
  latitude: string;
  longitude: string;
  street_id: number;
  room_number: string;
  customer_name: string;
  mobile_number: string;
  address?: string;
};

export type TypeLiveOrderFulfill = {
  driver_id: number;
  driver_name: string;
  driver_phone: string;
  tracking_link: string;
  driver_job_status: number;
  distance_travelled: string;
  completed_at: string | null;
  canceled_at: string | null;
};

export type TypeLiveOrderGroup = {
  created_by: string;
  created_from: string;
  delivery_model: number;
  cod_counter_type: number;
  counter_barcode: string | null;
  order_type: number;
  is_high_priveleged_vendor_order: boolean;
  bike_order: boolean;
};

export type TypeLiveOrderItem = {
  id: string;
  order_number: string;
  order_meta: TypeLiveOrderMeta;
  vendor_id: string;
  branch_id: string;
  vendor_order_id: string;
  pick_up: TypeLiveOrderPickup;
  drop_off: TypeLiveOrderDropOff;
  customer_name: string;
  mobile_number: string;
  payment_type: number;
  driver_id: number | null;
  status: number;
  created_at: string;
  amount_to_collect: string;
  fulfill: TypeLiveOrderFulfill | null;
  delivery_fee: string;
  delivery_distance: string;
  delivery_duration: string;
  order_group: TypeLiveOrderGroup;
  oms_agent_id: string | null;
  fresh_chat_restore_id: string | null;
  status_change_reason?: {
    reason: string;
  };
  primary_status: number;
  updated_address?: {
    is_addr_last_updated_by_customer: string | undefined;
  };
  delivery_model: any;
};

export type TypeRootLiveOrderList = {
  data: TypeLiveOrderItem[];
  count: number;
};

export type TypeOrderStatusHistoryHistory = {
  status_history: {
    primary_order_status: number;
    created_at: string;
  }[];
};

export type TypeRootOrderStatusHistoryHistory = {
  data: TypeOrderStatusHistoryHistory;
};

export type TypeStatusHistoryForUi = {
  id: number;
  text: string;
  time: string | null;
  subText: string;
  active: boolean;
  completed: boolean;
  display: boolean;
};

export const OrderStatusCSS = [
  { key: 0, value: 'NEW' },
  { key: 10, value: 'CONFIRMED' },
  { key: 20, value: 'BUDDY UNASSIGNED' },
  { key: 30, value: 'BUDDY ASSIGNED' },
  { key: 35, value: 'BUDDY QUEUED' },
  { key: 40, value: 'BUDDY DECLINED' },
  { key: 50, value: 'BUDDY ACCEPTED' },
  { key: 60, value: 'PICKUP STARTED' },
  { key: 70, value: 'ARRIVED PICKUP' },
  { key: 80, value: 'PICKED UP' },
  { key: 85, value: 'RESCHEDULED' },
  { key: 90, value: 'IN DELIVERY' },
  { key: 100, value: 'ARRIVED DESTINATION' },
  { key: 110, value: 'DELIVERED' },
  { key: 120, value: 'CANCELED' },
  { key: 130, value: 'DELIVERY_FAILED' },
] as const;

export const OrderStatus = [
  { key: 0, value: 'orderStatus.NEW' },
  { key: 10, value: 'orderStatus.CONFIRMED' },
  { key: 20, value: 'orderStatus.BUDDY_UNASSIGNED' },
  { key: 30, value: 'orderStatus.BUDDY_ASSIGNED' },
  { key: 35, value: 'orderStatus.BUDDY_QUEUED' },
  { key: 40, value: 'orderStatus.BUDDY_DECLINED' },
  { key: 50, value: 'orderStatus.BUDDY_ACCEPTED' },
  { key: 60, value: 'orderStatus.PICKUP_STARTED' },
  { key: 70, value: 'orderStatus.ARRIVED_PICKUP' },
  { key: 80, value: 'orderStatus.PICKED_UP' },
  { key: 85, value: 'orderStatus.RESCHEDULED' },
  { key: 90, value: 'orderStatus.IN_DELIVERY' },
  { key: 100, value: 'orderStatus.ARRIVED_DESTINATION' },
  { key: 110, value: 'orderStatus.DELIVERED' },
  { key: 120, value: 'orderStatus.CANCELED' },
  { key: 130, value: 'orderStatus.DELIVERY_FAILED' },
] as const;

export const ConfirmedStatus = [0, 10, 20];
export const DriverComingStatus = [35, 30, 50, 60];
export const WaitingStatus = [70];
export const DeliveringStatus = [80, 85, 90, 100];
export const CanceledStatus = [40, 120, 130];
export const DeliveryStatus = [110];

export const StatusToShowBuddyOnMap = [60, 70, 80, 90, 100];
export const TimerToShowOnMap = [80, 90, 100];

export const OrderStatusMappingForTick = [
  { key: 0, value: [10] },
  { key: 10, value: [10] },
  { key: 20, value: [10, 20] },
  { key: 30, value: [10, 30] },
  { key: 35, value: [10, 30] },
  { key: 40, value: [10, 40] },
  { key: 50, value: [10, 30] },
  { key: 60, value: [10, 30, 60] },
  { key: 70, value: [10, 30, 60, 70] },
  { key: 80, value: [10, 30, 60, 70, 80] },
  { key: 85, value: [10, 30, 60, 70, 80, 85] },
  { key: 90, value: [10, 30, 60, 70, 80, 85, 90] },
  { key: 100, value: [10, 30, 60, 70, 80, 85, 90, 100] },
  { key: 110, value: [10, 30, 60, 70, 80, 85, 90, 100, 110] },
] as const;

export const OrderStatusValues = {
  NEW: 0,
  CONFIRMED: 10,
  BUDDY_UNASSIGNED: 20,
  BUDDY_ASSIGNED: 30,
  BUDDY_QUEUED: 35,
  BUDDY_DECLINED: 40,
  BUDDY_ACCEPTED: 50,
  PICKUP_STARTED: 60,
  ARRIVED_PICKUP: 70,
  PICKED_UP: 80,
  RESCHEDULED: 85,
  IN_DELIVERY: 90,
  ARRIVED_DESTINATION: 100,
  DELIVERED: 110,
  CANCELED: 120,
  DELIVERY_FAILED: 130,
} as const;

export const TypeDelivery = [
  { key: 0, value: 'deliveryModel.unidentified' },
  { key: 1, value: 'deliveryModel.individual' },
  { key: 2, value: 'deliveryModel.group' },
  { key: 3, value: 'deliveryModel.bulk' },
  { key: 4, value: 'deliveryModel.massDeliveries' },
  { key: 5, value: 'deliveryModel.superSaverIndividual' },
  { key: 6, value: 'deliveryModel.superSaverGroup' },
] as const;

export const OperationType = [
  { key: 1, value: 'Recharge', color: 'bg-green-100 text-green-600' },
  { key: 2, value: 'Refund', color: 'bg-blue-100 text-blue-600' },
  { key: 3, value: 'Adjustment', color: 'bg-yellow-100 text-yellow-700' },
  { key: 4, value: 'DeductFee', color: 'bg-red-100 text-red-600' },
  { key: 5, value: 'MashkorCredit', color: 'bg-emerald-100 text-emerald-600' },
  { key: 6, value: 'MashkorDebit', color: 'bg-purple-100 text-purple-600' },
  { key: 7, value: 'MashkorDebit', color: 'bg-pink-100 text-pink-600' },
] as const;

export interface TypeUpdateAddressReq {
  floor: string;
  room_number: string;
  latitude: string;
  longitude: string;
  landmark: string;
  area: string;
  area_id: number;
  block: string;
  block_id: number;
  street: string;
  street_id: number;
  address: string;
}
export type TypeUpdateAddressResponce = {
  data: {
    order_number: string;
    status: number;
    vendor_id: string;
    branch_id: string;
    vendor_order_id: string;
    pick_up: {
      area: string;
      block: string;
      street: string;
      area_id: number;
      block_id: number;
      landmark: string;
      latitude: string;
      longitude: string;
      street_id: number;
      paci_number: string;
      customer_name: string;
      mobile_number: string;
    };
    drop_off: {
      latitude: string;
      longitude: string;
      paci_number: null;
      area: string;
      block: string;
      street: string;
      landmark: string;
      building: null;
      floor: string;
      room_number: string;
      address: null;
      customer_name: string;
      mobile_number: string;
      specific_driver_instructions: null;
      area_id: number;
      block_id: number;
      street_id: number;
      building_id: null;
    };
    customer_name: string;
    mobile_number: string;
    created_at: string;
    payment_type: number;
    amount_to_collect: string;
    fulfill: {
      driver_id: number;
      driver_name: string;
      driver_phone: string;
      tracking_link: string;
      driver_job_status: number;
      distance_travelled: string;
      completed_at: null;
      canceled_at: null;
    };
    order_group: {
      id: string;
      created_at: string;
      updated_at: string;
      deleted: boolean;
      order_type: number;
      created_by: string;
      created_from: string;
      delivery_model: number;
      need_delivery_calculation: boolean;
      calculation_rule_id: string;
      cod_counter_type: number;
      counter_barcode: null;
      api_request_payload: {};
      is_high_priveleged_vendor_order: boolean;
      bike_order: boolean;
    };
    source: number;
    primary_status: number;
  };
};

export interface TypeUpdatePaymentReq {
  payment_type: number;
  amount_to_collect: number;
}
