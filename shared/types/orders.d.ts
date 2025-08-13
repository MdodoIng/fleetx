export class Group {
  name: string;
  children: Options[];
}

export class Options {
  id: string;
  value: string;
}
export class Driver {
  fleet_id: number;
  name: string;
}

export class PickUp {
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
}

export class DropOffs {
  id: number;
  order_index: number;
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
  amount_to_collect: number = 0;
  payment_type: number;
}

export class BulkDropOffs extends DropOffs {
  address: string;
}

export class DropOffsDeliveryModel extends DropOffs {
  delivery_distance: number;
  delivery_fee: number;
  delivery_duration: number;
}

export class EstimatedDeliveryModel {
  vendor_id: string;
  branch_id: string;
  delivery_model: number;
  pickup: PickUp;
  drop_offs: DropOffsDeliveryModel[] = [];
  order_session_id: string = null;
}

export class OrderMeta {
  vendor_name: string;
  ot_trend: string;
  ot_free_drivers: number;
}

export class Orders {
  vendor_id: string;
  branch_id: string;
  driver_id: number;
  order_session_id: string;
  payment_type: number;
  order_meta: OrderMeta;
  pick_up: PickUp;
  drop_offs: DropOffs[] = [];
}

export class BulkOrderValidation {
  row: number;
  error: string;
}

export class OrderList {
  id: string;
  order_number: string;
  created_at: string;
  mashkor_order_number: string;
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
  drop_off: DropOffs;
  pick_up: PickUp;
  delivered_date: string;
  canceled_at: string;
  vendor_name: string;
  branch_name: string;
  counter_barcode: string;
  cod_counter_type: number;
  class_status: string;
  fresh_chat_restore_id: string;
  unread_chat: boolean = false;
  oms_agent_id: string;
  is_addr_last_updated_by_customer: boolean = false;
  is_active_card: boolean = false;
  delivery_duration: string;
  disply_current_delivery_duration: string;
}

export class OrderHistoryList {
  id: string;
  order_number: string;
  mashkor_order_number: string;
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
  payment_type: string;
  drop_off: DropOffs;
  delivery_distance: string;
  delivery_fee: string;
  delivery_model: string;
  vendor_name: string;
  branch_name: string;
  class_status: string;
  status_change_reason: string;
  is_addr_last_updated_by_customer: boolean = false;
  is_delivery_address_edit_enabled: boolean = false;
  branch_id: string;
  vendor_id: string;
  isSyncShow: boolean = false;
  isOlderData: boolean = false;
}

export class BulkInsights {
  orders_list: BulkInsightsList[];
  insights: any;
}

export class BulkInsightsList {
  id: string;
  order_number: string;
  mashkor_order_number: string;
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
  payment_type: string;
  drop_off: DropOffs;
  delivery_distance: string;
  delivery_fee: string;
  delivery_model: string;
  vendor_name: string;
  branch_name: string;
  class_status: string;
  status_change_reason: string;
  is_addr_last_updated_by_customer: boolean = false;
  is_delivery_address_edit_enabled: boolean = false;
  branch_id: string;
  vendor_id: string;
  isSyncShow: boolean = false;
  isOlderData: boolean = false;
}

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
];

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
];

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
];

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
};

export class OperationTime {
  start_time: string;
  end_time: string;
  full_day_operational: boolean;
  next_day: boolean;
}
export class AreaRestriction {
  start_time: string;
  end_time: string;
  full_day_restriction: boolean;
  next_day: boolean;
  enabled: boolean;
  area_radius: number;
}
export class SelectedAddressData {
  area_id: string;
  area: string;
  block_id: string;
  block: string;
  street_id: string;
  street: string;
  building_id: string;
  building: string;
}

export class UpdatePayment {
  payment_type: number;
  amount_to_collect: number;
}

export class UpdateAddress {
  address: string;
  area_id: number;
  area: string;
  block_id: number;
  block: string;
  street_id: number;
  street: string;
  building_id: number;
  building: string;
  floor: string;
  room_number: string;
  latitude: number;
  longitude: number;
  landmark: string;
}

export class SelectedAddress {
  id: number;
  name_en: string;
  latitude: number;
  longitude: number;
  type: string;
  unitNo: string;
  area_id: number;
  block_id: number;
  street_id: number;
  is_removed: boolean = false;
}

export const DeliveryModel = [
  { key: 0, value: 'deliveryModel.unidentified' },
  { key: 1, value: 'deliveryModel.individual' },
  { key: 2, value: 'deliveryModel.group' },
  { key: 3, value: 'deliveryModel.bulk' },
  { key: 4, value: 'deliveryModel.massDeliveries' },
  { key: 5, value: 'deliveryModel.superSaverIndividual' },
  { key: 6, value: 'deliveryModel.superSaverGroup' },
];

export const DeliveryModelCSS = [
  { key: 0, value: '' },
  { key: 1, value: 'Individual' },
  { key: 2, value: 'Group' },
  { key: 3, value: 'Bulk' },
  { key: 4, value: 'Mass Deliveries' },
  { key: 5, value: 'SuperSaver Individual' },
  { key: 6, value: 'SuperSaver Group' },
];

export const OperationType = [
  { key: 1, value: 'Recharge' },
  { key: 2, value: 'Refund' },
  { key: 3, value: 'Adjustment' },
  { key: 4, value: 'DeductFee' },
  { key: 5, value: 'MashkorCredit' },
  { key: 6, value: 'MashkorDebit' },
  { key: 7, value: 'MashkorDebit' },
];

export class ViewDeliveryData {
  startAddrressRight: string = '';
  endAddressRight: string = '';
  deliveryDistanceRight: string;
  deliveryFeeRight: string;
  address: string;
  customerName: string;
}

export class ExportFilter {
  searchOrder: string;
  searchCustomer: string;
  searchDriver: number;
  selectedFromDate: Date;
  selectedToDate: Date;
  searchAll: boolean;
  selectedAccountManager: string;
  selectedSorting: string;
  type: number;
}

export let calulatedActions = {
  deleted: 1,
  edit: 2,
  add: 3,
  changeBranch: 4,
  addressRemove: 5,
};

export class UploadedDropOffs {
  id: number;
  address: string;
  vendorOrderId: string;
  customerName: string;
  mobileNumber: number;
  driverInstructions: string;
  quantity: number;
  amountToCollect: number = 0;
  paymentType: number;
  paymentDisplayType: string;
  enableChecked: boolean = false;
  addresses: any[] = [];
}

export class SelectedHeders {
  address: any[] = [];
  vendorOrderId: string;
  customerName: string;
  mobileNumber: number;
  driverInstructions: string;
  cod: string;
}

export class salesFunnel {
  percentage: string;
  text: string;
  count: number;
}

export const OrderSource = [
  { key: 1, value: 'Courier Dashboard' },
  { key: 2, value: 'Integration Api' },
  { key: 3, value: 'Chrome Extension' },
  { key: 4, value: 'Courier ReOrder' },
];

export const DELIVERED = 'DELIVERED';
export const CANCELED = 'CANCELED';
export const RESCHEDULED = 'RESCHEDULED';

// For New Order
export class LiveOrderDisplayModel {
  source: string;
  destination: string;
  distance: number;
  deliveryFee: number;
}

export class DropOffCardValue {
  source: string;
  destination: string;
  distance: number;
  deliveryFee: number;
  address: string;
  customerName: string;
  index: number;
}

export class TotalOrderHistory {
  totalOrders: number;
  totalKM: number;
  totalDelivery: number;
}

export interface ZoneETPTrend {
  etpMins?: number;
  etpMoreThanConfigValue?: boolean;
  avgPromisedETP?: number;
  isEnable?: boolean;
  freeBuddies?: number;
}
