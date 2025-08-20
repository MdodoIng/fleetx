export type TypeLiveOrderDisplay = {
  source?: string;
  destination?: string;
  distance?: number;
  deliveryFee?: number;
};

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

export type TypeEstimatedDeliveryReturnFromApi = {
  data: {
    vendor_id: string;
    branch_id: string;
    delivery_model: number;
    pickup: TypePickUp;
    drop_offs: TypeDropOffsDelivery[];
    order_session_id: string | null;
  };
};

export type TypeOrderList = {
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

export const TypeDelivery = [
  { key: 0, value: 'deliveryModel.unidentified' },
  { key: 1, value: 'deliveryModel.individual' },
  { key: 2, value: 'deliveryModel.group' },
  { key: 3, value: 'deliveryModel.bulk' },
  { key: 4, value: 'deliveryModel.massDeliveries' },
  { key: 5, value: 'deliveryModel.superSaverIndividual' },
  { key: 6, value: 'deliveryModel.superSaverGroup' },
] as const;
