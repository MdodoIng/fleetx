import { MenuItem, Routes } from '../types/constants';

export const routes: Routes = {
  ORDER_CREATE: {
    path: '/order/create',
    title: 'layout.menuItems.orderSubMenu.newOrder.title',
    subtitle: 'layout.menuItems.orderSubMenu.newOrder.subtitle',
    icon: 'newOrder',
  },
  ORDER_BULK: {
    path: '/order/bulk',
    title: 'layout.menuItems.orderSubMenu.bulkOrder.title',
    subtitle: 'layout.menuItems.orderSubMenu.bulkOrder.subtitle',
    icon: 'newOrder',
  },
  ORDER_LIVE: {
    path: '/order/live',
    title: 'layout.menuItems.orderSubMenu.liveOrder.title',
    subtitle: 'layout.menuItems.orderSubMenu.liveOrder.subtitle',
    icon: 'activeOrders',
  },
  ORDER_HISTORY: {
    path: '/order/history',
    title: 'layout.menuItems.orderSubMenu.history.title',
    subtitle: 'layout.menuItems.orderSubMenu.history.subtitle',
    icon: 'history',
  },
  ORDER_BULK_INSIGHTS: {
    path: '/order/bulk-insights',
    title: 'layout.menuItems.orderSubMenu.bulkInsights.title',
    subtitle: 'layout.menuItems.orderSubMenu.bulkInsights.subtitle',
    icon: 'bulkInsights',
  },
  DASHBOARD: {
    path: '/dashboard',
    title: 'layout.menuItems.dashboard.title',
    subtitle: 'layout.menuItems.dashboard.subtitle',
    icon: 'activeOrders',
    roles: ['OPERATION_MANAGER', 'SALES_HEAD', 'FINANCE_MANAGER'],
  },
  VENDOR_LIST: {
    path: '/vendor/list',
    title: 'layout.menuItems.vendorSubMenu.vendorList.title',
    subtitle: 'layout.menuItems.vendorSubMenu.vendorList.subtitle',
    icon: 'peopleList',
    roles: [
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
      'FINANCE_MANAGER',
    ],
  },
  VENDOR_ADD: {
    path: '/vendor/add',
    title: 'layout.menuItems.vendorSubMenu.addNewVendor.title',
    subtitle: 'layout.menuItems.vendorSubMenu.addNewVendor.subtitle',
    icon: 'userPlus',
    roles: [
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
      'FINANCE_MANAGER',
    ],
  },
  VENDOR_USERS: {
    path: '/vendor/users',
    title: 'layout.menuItems.vendorSubMenu.users.title',
    subtitle: 'layout.menuItems.vendorSubMenu.users.subtitle',
    icon: 'users',
    roles: [
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
      'FINANCE_MANAGER',
    ],
  },
  VENDOR_ACCOUNT_MANAGER: {
    path: '/vendor/account-manager',
    title: 'layout.menuItems.vendorSubMenu.accountManager.title',
    subtitle: 'layout.menuItems.vendorSubMenu.accountManager.subtitle',
    icon: 'history',
    roles: ['VENDOR_ACCOUNT_MANAGER', 'SALES_HEAD', 'FINANCE_MANAGER'],
  },
  WALLET_OVERVIEW: {
    path: '/wallet/overview',
    title: 'layout.menuItems.walletSubMenu.myWallet.title',
    subtitle: 'layout.menuItems.walletSubMenu.myWallet.subtitle',
    icon: 'myWallet',
  },
  WALLET_HISTORY: {
    path: '/wallet/history',
    title: 'layout.menuItems.walletSubMenu.history.title',
    subtitle: 'layout.menuItems.walletSubMenu.history.subtitle',
    icon: 'history',
  },
  WALLET_PAYMENT_HISTORY: {
    path: '/wallet/payment-history',
    title: 'layout.menuItems.walletSubMenu.paymentHistory.title',
    subtitle: 'layout.menuItems.walletSubMenu.paymentHistory.subtitle',
    icon: 'history',
    roles: ['FINANCE_MANAGER'],
  },
  WALLET_MANUAL_PAYMENT: {
    path: '/wallet/manual-payment',
    title: 'layout.menuItems.walletSubMenu.manualPayment.title',
    subtitle: 'layout.menuItems.walletSubMenu.manualPayment.subtitle',
    icon: 'myWallet',
    roles: ['FINANCE_MANAGER'],
  },
  WALLET_BALANCE_REPORT: {
    path: '/wallet/balance-report',
    title: 'layout.menuItems.walletSubMenu.balanceReport.title',
    subtitle: 'layout.menuItems.walletSubMenu.balanceReport.subtitle',
    icon: 'myWallet',
    roles: ['FINANCE_MANAGER', 'OPERATION_MANAGER', 'SALES_HEAD'],
  },
  BILLING_EDIT_PROFILE: {
    path: '/billing/edit-profile',
    title: 'layout.profile.editBilling.title',
    subtitle: 'layout.profile.editBilling.subtitle',
    icon: 'bill',
    roles: ['VENDOR_USER'],
  },
  BILLING_INVOICE: {
    path: '/billing/invoice',
    title: 'layout.menuItems.billingSubMenu.invoice.title',
    subtitle: 'layout.menuItems.billingSubMenu.invoice.subtitle',
    icon: 'history',
    roles: ['VENDOR_USER'],
  },
  INSIGHTS_OVERVIEW: {
    path: '/insights/overview',
    title: 'layout.menuItems.insightsSubMenu.overview.title',
    subtitle: 'layout.menuItems.insightsSubMenu.overview.subtitle',
    icon: 'history',
    roles: [
      'FINANCE_MANAGER',
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
    ],
  },
  INSIGHTS_CHURN_REASONS: {
    path: '/insights/churn-reasons',
    title: 'layout.menuItems.insightsSubMenu.churnReasons.title',
    subtitle: 'layout.menuItems.insightsSubMenu.churnReasons.subtitle',
    icon: 'history',
    roles: [
      'FINANCE_MANAGER',
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
    ],
  },
  INSIGHTS_FIRST_ORDER: {
    path: '/insights/first-order',
    title: 'layout.menuItems.insightsSubMenu.firstOrder.title',
    subtitle: 'layout.menuItems.insightsSubMenu.firstOrder.subtitle',
    icon: 'history',
    roles: [
      'FINANCE_MANAGER',
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
    ],
  },
  INSIGHTS_AFF_REFERRALS: {
    path: '/insights/aff_referrals',
    title: 'layout.menuItems.insightsSubMenu.affReferrals.title',
    subtitle: 'layout.menuItems.insightsSubMenu.affReferrals.subtitle',
    icon: 'history',
    roles: [
      'FINANCE_MANAGER',
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
    ],
  },
  INSIGHTS_USER_REFERRALS: {
    path: '/insights/user_referrals',
    title: 'layout.menuItems.insightsSubMenu.userReferrals.title',
    subtitle: 'layout.menuItems.insightsSubMenu.userReferrals.subtitle',
    icon: 'history',
    roles: [
      'FINANCE_MANAGER',
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
    ],
  },
  INSIGHTS_ZONE_GROWTH: {
    path: '/insights/zone-growth',
    title: 'layout.menuItems.insightsSubMenu.zoneGrowth.title',
    subtitle: 'layout.menuItems.insightsSubMenu.zoneGrowth.subtitle',
    icon: 'history',
    roles: [
      'FINANCE_MANAGER',
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
    ],
  },
  OTHERS_INTEGRATIONS: {
    path: '/config/integrations',
    title: 'layout.menuItems.othersSubMenu.integrations.title',
    subtitle: 'layout.menuItems.othersSubMenu.integrations.subtitle',
    icon: 'integrations',
    roles: ['VENDOR_USER'],
  },
  SALES_FUNNEL: {
    path: '/order/sales-funnel',
    title: 'layout.menuItems.salesFunnel.title',
    subtitle: 'layout.menuItems.salesFunnel.subtitle',
    icon: 'history',
    roles: ['SALES_HEAD', 'OPERATION_MANAGER', 'FINANCE_MANAGER'],
  },
  RATING: {
    path: '/rating',
    title: 'layout.menuItems.rating.title',
    subtitle: 'layout.menuItems.rating.subtitle',
    icon: 'history',
    roles: ['OPERATION_MANAGER', 'SALES_HEAD', 'FINANCE_MANAGER'],
  },
  CONFIG_CHANGE_PASSWORD: {
    path: '/config/change-password',
    title: 'layout.profile.changePassword.title',
    subtitle: 'layout.profile.changePassword.subtitle',
    icon: 'password',
  },
};

export const APP_SIDEBAR_MENU: MenuItem[] = [
  {
    labelKey: routes.DASHBOARD.title,
    route: routes.DASHBOARD.path,
    icon: routes.DASHBOARD.icon,
    roles: routes.DASHBOARD.roles,
  },
  {
    labelKey: 'layout.menuItems.order',
    children: [
      {
        labelKey: routes.ORDER_CREATE.title,
        route: routes.ORDER_CREATE.path,
        icon: routes.ORDER_CREATE.icon,
      },
      {
        labelKey: routes.ORDER_LIVE.title,
        route: routes.ORDER_LIVE.path,
        icon: routes.ORDER_LIVE.icon,
      },
      {
        labelKey: routes.ORDER_HISTORY.title,
        route: routes.ORDER_HISTORY.path,
        icon: routes.ORDER_HISTORY.icon,
      },
      {
        labelKey: routes.ORDER_BULK.title,
        route: routes.ORDER_BULK.path,
        icon: routes.ORDER_BULK.icon,
      },
      {
        labelKey: routes.ORDER_BULK_INSIGHTS.title,
        route: routes.ORDER_BULK_INSIGHTS.path,
        icon: routes.ORDER_BULK_INSIGHTS.icon,
      },
    ],
  },
  {
    labelKey: 'layout.menuItems.vendor',
    children: [
      {
        labelKey: routes.VENDOR_LIST.title,
        route: routes.VENDOR_LIST.path,
        icon: routes.VENDOR_LIST.icon,
        roles: routes.VENDOR_LIST.roles,
      },
      {
        labelKey: routes.VENDOR_ADD.title,
        route: routes.VENDOR_ADD.path,
        icon: routes.VENDOR_ADD.icon,
        roles: routes.VENDOR_ADD.roles,
      },
      {
        labelKey: routes.VENDOR_USERS.title,
        route: routes.VENDOR_USERS.path,
        icon: routes.VENDOR_USERS.icon,
        roles: routes.VENDOR_USERS.roles,
      },
      {
        labelKey: routes.VENDOR_ACCOUNT_MANAGER.title,
        route: routes.VENDOR_ACCOUNT_MANAGER.path,
        icon: routes.VENDOR_ACCOUNT_MANAGER.icon,
        roles: routes.VENDOR_ACCOUNT_MANAGER.roles,
      },
    ],
  },
  {
    labelKey: 'layout.menuItems.wallet',
    children: [
      {
        labelKey: routes.WALLET_OVERVIEW.title,
        route: routes.WALLET_OVERVIEW.path,
        icon: routes.WALLET_OVERVIEW.icon,
      },
      {
        labelKey: routes.WALLET_HISTORY.title,
        route: routes.WALLET_HISTORY.path,
        icon: routes.WALLET_HISTORY.icon,
      },
      {
        labelKey: routes.WALLET_PAYMENT_HISTORY.title,
        route: routes.WALLET_PAYMENT_HISTORY.path,
        icon: routes.WALLET_PAYMENT_HISTORY.icon,
        roles: routes.WALLET_PAYMENT_HISTORY.roles,
      },
      {
        labelKey: routes.WALLET_MANUAL_PAYMENT.title,
        route: routes.WALLET_MANUAL_PAYMENT.path,
        icon: routes.WALLET_MANUAL_PAYMENT.icon,
        roles: routes.WALLET_MANUAL_PAYMENT.roles,
      },
      {
        labelKey: routes.WALLET_BALANCE_REPORT.title,
        route: routes.WALLET_BALANCE_REPORT.path,
        icon: routes.WALLET_BALANCE_REPORT.icon,
        roles: routes.WALLET_BALANCE_REPORT.roles,
      },
    ],
  },
  {
    labelKey: 'layout.menuItems.insights',
    children: [
      {
        labelKey: routes.INSIGHTS_OVERVIEW.title,
        route: routes.INSIGHTS_OVERVIEW.path,
        icon: routes.INSIGHTS_OVERVIEW.icon,
        roles: routes.INSIGHTS_OVERVIEW.roles,
      },
      {
        labelKey: routes.INSIGHTS_CHURN_REASONS.title,
        route: routes.INSIGHTS_CHURN_REASONS.path,
        icon: routes.INSIGHTS_CHURN_REASONS.icon,
        roles: routes.INSIGHTS_CHURN_REASONS.roles,
      },
      {
        labelKey: routes.INSIGHTS_FIRST_ORDER.title,
        route: routes.INSIGHTS_FIRST_ORDER.path,
        icon: routes.INSIGHTS_FIRST_ORDER.icon,
        roles: routes.INSIGHTS_FIRST_ORDER.roles,
      },
      {
        labelKey: routes.INSIGHTS_AFF_REFERRALS.title,
        route: routes.INSIGHTS_AFF_REFERRALS.path,
        icon: routes.INSIGHTS_AFF_REFERRALS.icon,
        roles: routes.INSIGHTS_AFF_REFERRALS.roles,
      },
      {
        labelKey: routes.INSIGHTS_USER_REFERRALS.title,
        route: routes.INSIGHTS_USER_REFERRALS.path,
        icon: routes.INSIGHTS_USER_REFERRALS.icon,
        roles: routes.INSIGHTS_USER_REFERRALS.roles,
      },
      {
        labelKey: routes.INSIGHTS_ZONE_GROWTH.title,
        route: routes.INSIGHTS_ZONE_GROWTH.path,
        icon: routes.INSIGHTS_ZONE_GROWTH.icon,
        roles: routes.INSIGHTS_ZONE_GROWTH.roles,
      },
    ],
  },
  {
    labelKey: 'layout.menuItems.others',
    children: [
      {
        labelKey: routes.OTHERS_INTEGRATIONS.title,
        route: routes.OTHERS_INTEGRATIONS.path,
        icon: routes.OTHERS_INTEGRATIONS.icon,
        roles: routes.OTHERS_INTEGRATIONS.roles,
      },
    ],
  },
  {
    labelKey: routes.SALES_FUNNEL.title,
    route: routes.SALES_FUNNEL.path,
    roles: routes.SALES_FUNNEL.roles,
    icon: routes.SALES_FUNNEL.icon,
  },
  {
    labelKey: routes.RATING.title,
    route: routes.RATING.path,
    roles: routes.RATING.roles,
    icon: routes.RATING.icon,
  },
] as const;

export const APP_PROFILE_MENU: MenuItem[] = [
  {
    labelKey: routes.CONFIG_CHANGE_PASSWORD.title,
    route: routes.CONFIG_CHANGE_PASSWORD.path,
    icon: routes.CONFIG_CHANGE_PASSWORD.icon,
  },
  {
    labelKey: routes.BILLING_EDIT_PROFILE.title,
    route: routes.BILLING_EDIT_PROFILE.path,
    icon: routes.BILLING_EDIT_PROFILE.icon,
  },
] as const;
