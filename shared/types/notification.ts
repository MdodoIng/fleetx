export type TypeNotificationMeta = {
  customer_email: string | null;
};

export type TypeNotificationItem = {
  id: number;
  entity_id: string;
  message: string;
  entity_type: number;
  entity_operation_type: number;
  op_read: boolean;
  vendor_read: boolean;
  notification_meta: TypeNotificationMeta;
  vendor_id: string;
  branch_id: string;
  notify_at: string;
  color: number;
};

export type TypeNotificationsResponse = {
  data: TypeNotificationItem[];
  count: number;
};

export type TypeGetWarningMessageApiResponse = {
  data: {
    id: number;
    message: string;
    enabled: boolean;
  }[];
};

export type { TypeNotificationsResponse as 'data' };

export type TypeOperationTimeApi = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  timing_type: number;
  vendor_id: string | null;
  branch_id: string | null;
  start_time: string; // "HH:mm:ss"
  end_time: string; // "HH:mm:ss"
  full_day_operational: boolean;
  next_day: boolean;
};

export type TypeOperationTimeApiResponse = {
  data: TypeOperationTimeApi;
};
