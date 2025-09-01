export type TypeBalanceAlertReq = {
  vendor_id: string;
  branch_id: string;
  alert_threshold: number;
  alert_enabled: boolean;
};

export type TypePaymentAddReq = {
  vendor_id: string;
  branch_id: string;
  amount: number;
  reason: string;
};

export type TypeWalletNotifyBalanceRes = {
  data: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted: boolean;
    alert_on_amount: string;
    required_email_alert: boolean;
    required_sms_alert: boolean;
    vendor_id: string;
    branch_id: string;
  };
};

export const TypePayment = [
  {
    id: 5,
    name: 'Credit',
  },
  {
    id: 6,
    name: 'Debit',
  },
] as const;

export type TypeManualPaymentHistoryReportRes = {
  data: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted: boolean;
    amount: string;
    operation_type: number;
    vendor_id: string;
    branch_id: string;
    note: string;
    status: number;
    created_by: string;
    wallet_type: number;
  }[];
  count: number;
};
