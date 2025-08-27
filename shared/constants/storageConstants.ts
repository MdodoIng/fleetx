export const storageConstants = {
  user_context: 'user_context',
  auth_app_token: 'auth_app_token',
  survey_key: 'survey_key',
  userid: 'userid',
  refresh_time: 'refresh_time',
  rate_notify_time: 'rate_notify_time',
  rate_notify_day_time: 'rate_notify_day_time',
  rate_notify_count: 'rate_notify_count',
  area_restriction: 'a_r_data',
  busy_mode: 'b_m_data',
  zone_busy_mode: 'z_b_m_data',
  app_version: 'a_v',
  branch_id:""
};

export const uploadFiles = {
  fileExt: ['xlsx', 'csv'],
};

export const commonConstants = {
  notificationTime: 1,
  timeIntervelForBusyMode: 1,
  timeIntervelForAreaRestriction: 1,
  ORDER_LIMIT: 10,
  ORDER_LIMIT_BAHRAIN: 10,
  passwordMinLength: 6,
  bulkOrderLimit: 5,
  walletHistoryPerPage: 5,
  notificationPerPage: 10,
  settlementDuePerPage: 50,
  settlementHistoryPerPage: 10,
  settlementHistoryOrderDetialsPerPage: 10,
  cashCollectionHistoryPerPage: 10,
  orderHistoryPerPage: 30,
  orderStatusPerPage: 20,
  rateBuddyListPerPage: 20,
  rateNoticationTimeMinute: 60,
  rateNoticationShowCount: 5,
  busyModeHistoryPerPage: 10,
  zoneBusyModeHistoryPerPage: 10,
  vendorUserListPerPage: 30,
  firstOrderListPerPage: 10,
  referralPerPage: 20,
  orderTransparencyMaxMins: 15,
  orderTransparencyLastUpdatedTimeConfigMins: 15,
  checkingOrderTransparencyAPIUpdatedTime: 15,
  reActivationPerPage: 100,
  newOrderStatusPageCount: 500,
  onlinePaymentHistoryPageCount: 100,
  balanceReportPageCount: 50,
  accountManagerCount: 10,
};

export interface Dialog {
  Type: DialogTypes;
  Message: string;
}

export enum DialogTypes {
  Success,
  Error,
  Info,
  Warning,
  Delete,
  Confirmation,
  Update,
  AddtoUserLibrary,
  PullBack,
  SendBack,
  Confirm,
  PlaceOrderOne,
  PlaceOrderTwo,
  CommonConfirm,
  Regenerate,
  BlockActivation,
  ReOrder,
  MultipleReOrder,
  AppVersionRefresh, //18
}

export const funnelStage = {
  NoOrderNoRecharge: 10, // "Activation: Not recharged wallet yet",
  NoOrderFollowUp1: 20, // "Activation: Follow Up for no-recharge",
  NoOrderRecharged: 30, // "Activation: Recharged but did not place first order",
  NoOrderFollowUp2: 40, // "Activation: Recahrged and followed up for no first order",
  Activated: 50, // "Activation: Recahrged and Order placed"},
  NoRecharge: 60, // "Retention: Not recharged after wallet notification"},
  FollowUp1: 70, // "Retention: Follow Up for no-recharge after wallet notification"},
  Recharged: 80, // "Retention: Recharged but did not place order after wallet notification"},
  FollowUp2: 90, // "Retention: Recahrged and followed up for no order after wallet notification"},
  Retained: 100, // "Retention: Recahrged and Order placed"
  NoOrderHasWallet: 110, //"NoOrderHasWallet: No order placed but has non-zero wallet"},
  NoOrderHasWalletFollowUp1: 120, //"NoOrderHasWallet: NoOrderHasWallet Followup1"
  NoOrderHasWalletFollowUp2: 130, //"NoOrderHasWallet: NoOrderHasWallet Followup2"},
  NoOrderHasWalletRetained: 140, // "NoOrderHasWallet: Branch created order"},
  ReActivationChurned: 150, // "ReActivation: Branch is churned long ago"
  ReActivationContacted: 160, //"ReActivation: Branch is contacted"
  ReActivationInProgress: 170, //"ReActivation: Branch started crating orders"
  ReActivated: 180, //"ReActivation: Branch is reactivated"
  ReActivationDormant: 190, // "ReActivation: Dormant branches from contacted/reactivation"
};

export const rateType = {
  rateDelivery: 1,
  ratePickUp: 2,
  ratePickUpFromNotify: 3,
  rateFirstOrderPickUp: 4,
};

export const rateDashBoardValue = {
  mashkorRating: 'MashkorRating',
  mashkorRatingCount: 'MashkorRatingCount',
  courierDashboard: 'CourierDashboard',
  courierDashboardCount: 'CourierDashboardCount',
  courierDashboardPickup: 'CourierDashboardPickup',
  courierDashboardPickupCount: 'CourierDashboardPickupCount',
  courierDashboardDelivery: 'CourierDashboardDelivery',
  courierDashboardDeliveryCount: 'CourierDashboardDeliveryCount',
  mobileApp: 'MobileApp',
  mobileAppCount: 'MobileAppCount',
  mobileAppBuy: 'MobileAppBuy',
  mobileAppBuyCount: 'MobileAppBuyCount',
  mobileAppPickup: 'MobileAppPickup',
  mobileAppPickupCount: 'MobileAppPickupCount',
  sellerDashboard: 'SellerDashboard',
  sellerDashboardCount: 'SellerDashboardCount',
  sellerDashboardPickup: 'SellerDashboardPickup',
  sellerDashboardPickupCount: 'SellerDashboardPickupCount',
  sellerDashboardDelivery: 'SellerDashboardDelivery',
  sellerDashboardDeliveryCount: 'SellerDashboardDeliveryCount',
  improvementType_1: 'ImprovementType_1',
  improvementType_2: 'ImprovementType_2',
  improvementType_3: 'ImprovementType_3',
  improvementType_4: 'ImprovementType_4',
};

export const MAX_RATE = 5;
export const SCROLL_COUNT = 160;

export const RATE_REASONS_EN: any[] = [
  { id: 1, name: "Buddy's Hygiene" },
  { id: 2, name: 'Late Pickup' },
  { id: 3, name: 'Late Delivery' },
  { id: 4, name: "Buddy's Behavior" },
];

export const RATE_REASONS_AR: any[] = [
  { id: 1, name: "نظافه السائق" },
  { id: 2, name: 'التأخر في استلام الطلب' },
  { id: 3, name: 'التأخر في توصيل الطلب' },
  { id: 4, name: "سلوك السائق" },
];

export const RATE_TYPE: any[] = [
  { id: 1, name: 'Pickup' },
  { id: 2, name: 'Delivery' },
  { id: 3, name: 'Custom Buy' },
  { id: 4, name: 'Custom Pickup' },
];

export const CHURN_REASONS: any[] = [
  { id: 1, name: 'High delivery rates' },
  { id: 2, name: 'Frequent delays' },
  { id: 3, name: 'Driver behavior' },
  { id: 4, name: 'Damaged order' },
  { id: 5, name: 'Low demand' },
  { id: 6, name: 'Poor Support' },
];

export const BUSY_MODE_TYPE: any[] = [
  { id: 'highDemand', name: 'High Demand' },
  { id: 'badWeatherConditions', name: 'Bad Weather Conditions' },
  { id: 'congestedTraffic', name: 'Congested Traffic' },
  { id: 'iftarTiming', name: 'Iftar timing' },
  { id: 'technicalIssue', name: 'Technical Issue' },
];

export const NOTIFICATION_TYPE = {
  FRESHCHAT_UNREAD: 'FRESHCHAT_UNREAD',
  RATING: 'RATING',
  PICKUP_STARTED: 'PICKUP_STARTED',
  CUSTOMER_ADDRESS_UPDATE: 'CUSTOMER_ADDRESS_UPDATE',
  BUSY_MODE_ACTIVATED: 'BUSY_MODE_ACTIVATED',
  BUSY_MODE_DEACTIVATED: 'BUSY_MODE_DEACTIVATED',
  OPERATION_TIMING: 'OPERATION_TIMING',
  AREA_RESTRICTION: 'AREA_RESTRICTION',
  VENDOR_BRANCH_UPDATE: 'VENDOR_BRANCH_UPDATE',
  ORDER_SCREEN_MESSAGE_UPDATE: 'ORDER_SCREEN_MESSAGE_UPDATE',
  ZONE_BUSY_MODE_DEACTIVATED: 'ZONE_BUSY_MODE_DEACTIVATED',
  ORDER_STATUS_UPDATE: 'ORDER_STATUS_UPDATE',
  ORDER_UPATE: 'ORDER_UPATE',
  NEW_ORDER_CREATION: 'NEW_ORDER_CREATION',
  ZONE_AVG_PICKUP_TREND_UPDATED: 'ZONE_AVG_PICKUP_TREND_UPDATED',
  B2C_FREE_BUDDY_UPDATE: 'B2C_FREE_BUDDY_UPDATE',
  ZONE_BUSY_MODE_ACTIVATED: 'ZONE_BUSY_MODE_ACTIVATED',
};

export const BULK_INSIGHTS_TYPES = {
  created_count: 'Created',
  delivered_count: 'Delivered',
  canceled_count: 'Cancelled',
  total_rescheduled_count: 'Total rescheduled',
  active_rescheduled_count: 'Active rescheduled',
}




export const PAYMENTTYPE = {
  COD: '1',
  KNET: '2',
};

export const KUWAIT = 'kuwait';
export const BAHRAIN = 'bahrain';
export const QATAR = 'qatar';

export const COOKIE_DOMAIN = 'COOKIE_DOMAIN';
export const COOKIE_AFF_REF_CODE = 'COOKIE_AFF_REF_CODE';
export const BUDDY_AVATAR = 'assets/images/avatar.png';
