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

export type { TypeNotificationsResponse as 'data' };
