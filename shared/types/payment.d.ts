export type TypeBalanceAlertReq = {
  vendor_id: string;
  branch_id: string;
  alert_threshold: number;
  alert_enabled: boolean;
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

