export interface Group {
  name: string;
  children: Option[];
}

export interface Option {
  id: string;
  value: string;
}

export interface Driver {
  fleet_id: number;
  name: string;
}

export interface PickUp {
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

export interface DropOff {
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
  amount_to_collect: number;
  payment_type: number;
}

export type BulkDropOff = DropOff;

export interface DropOffDeliveryModel extends DropOff {
  delivery_distance: number;
  delivery_fee: number;
  delivery_duration: number;
}

export interface EstimatedDeliveryModel {
  vendor_id: string;
  branch_id: string;
  delivery_model: number;
  pickup: PickUp;
  drop_offs: DropOffDeliveryModel[];
  order_session_id?: string;
}

export interface OrderMeta {
  vendor_name: string;
  ot_trend: string;
  ot_free_drivers: number;
}

export interface Order {
  vendor_id: string;
  branch_id: string;
  driver_id: number;
  order_session_id: string;
  payment_type: number;
  order_meta: OrderMeta;
  pick_up: PickUp;
  drop_offs: DropOff[];
}

export interface BulkOrderValidation {
  row: number;
  error: string;
}

export interface OrderList {
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
  drop_off: DropOff;
  pick_up: PickUp;
  delivered_date: string;
  canceled_at: string;
  vendor_name: string;
  branch_name: string;
  counter_barcode: string;
  cod_counter_type: number;
  interface_status: string;
  fresh_chat_restore_id: string;
  unread_chat?: boolean; // ✅ optional, no default in interface
  oms_agent_id: string;
  is_addr_last_updated_by_customer?: boolean;
  is_active_card?: boolean;
  delivery_duration: string;
  disply_current_delivery_duration: string;
}

export interface OrderHistory {
  total_completed_order: number;
  total_canceled_order: number;
  total_driver_canceled_order: number;
  total_vendor_canceled_order: number;
  total_oms_canceled_order: number;
  total_amount_collected: number;
}

export interface TotalOrderHistory extends OrderHistory {
  total_orders: number;
}

export interface LiveOrderDisplayModel {
  order_number: string;
  order_session_id: string;
  customer_name: string;
  phone_number: string;
  driver_name: string;
  driver_id: number;
  driver_avatar: string;
  status: string;
  status_code: number;
  tracking_link: string;
  pick_up: PickUp;
  drop_offs: DropOff[];
  created_at: string;
  vendor_name: string;
  branch_name: string;
  counter_barcode: string;
  cod_counter_type: number;
  unread_chat?: boolean;
  is_active_card?: boolean;
}

export interface SelectedAddress {
  area_id: number;
  block_id: number;
  street_id: number;
  building_id: number;
  latitude: string;
  longitude: string;
}

export interface DropOffCardValue {
  order_number: string;
  customer_name: string;
  mobile_number: string;
  address: string;
  amount_to_collect: number;
  payment_type: number;
  delivery_fee: number;
  delivery_distance: number;
}
