import { UserRole } from '@/shared/types/auth';
import { SUB_MENU } from './routes';

export interface MenuItem {
  labelKey: string;
  route?: string;
  roles?: UserRole[];
  icon: string;
  children?: MenuItem[];
  iconClass?: string;
}

export const APP_SIDEBAR_MENU: MenuItem[] = [
  {
    labelKey: 'menuItems.dashboard',
    route: '/dashboard',
    icon: 'icon-dashboard',
    roles: ['OPERATION_MANAGER', 'SALES_HEAD', 'FINANCE_MANAGER'],
  },
  {
    labelKey: 'menuItems.order',
    icon: 'icon-order',
    children: [
      {
        labelKey: 'menuItems.orderSubMenu.newOrder',
        route: SUB_MENU.NEW_ORDER_OLD.LINK,
        icon: 'icon-new-order',
      },
      {
        labelKey: 'menuItems.orderSubMenu.bulkOrder',
        route: '/order/bulk',
        icon: 'icon-bulk-order',
      },
      {
        labelKey: 'menuItems.orderSubMenu.liveOrder',
        route: '/order/live',
        icon: 'icon-live-order',
      },
      {
        labelKey: 'menuItems.orderSubMenu.history',
        route: '/order/history',
        icon: 'icon-history',
      },
      {
        labelKey: 'menuItems.orderSubMenu.bulkInsights',
        route: '/order/bulk-insights',
        icon: 'icon-insights',
      },
    ],
  },
  {
    labelKey: 'menuItems.vendor',
    route: '/vendor',
    icon: 'icon-vendor',
    roles: [
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
      'FINANCE_MANAGER',
    ],
    children: [
      {
        labelKey: 'menuItems.vendorSubMenu.vendorList',
        route: '/vendor/list',
        icon: 'icon-list',
      },
      {
        labelKey: 'menuItems.vendorSubMenu.addNewVendor',
        route: '/vendor/add',
        icon: 'icon-add-vendor',
      },
      {
        labelKey: 'menuItems.vendorSubMenu.users',
        route: '/vendor/users',
        icon: 'icon-users',
      },
      {
        labelKey: 'menuItems.vendorSubMenu.accountManager',
        route: '/vendor/account-manager',
        icon: 'icon-account-manager',
        roles: ['SALES_HEAD'],
      },
    ],
  },
  {
    labelKey: 'menuItems.wallet',
    route: '/wallet',
    icon: 'icon-wallet',
    children: [
      {
        labelKey: 'menuItems.walletSubMenu.myWallet',
        route: '/wallet/overview',
        icon: 'icon-my-wallet',
      },
      {
        labelKey: 'menuItems.walletSubMenu.history',
        route: '/wallet/history',
        icon: 'icon-history',
      },
      {
        labelKey: 'menuItems.walletSubMenu.paymentHistory',
        route: '/wallet/payment-history',
        icon: 'icon-payment',
        roles: ['FINANCE_MANAGER'],
      },
      {
        labelKey: 'menuItems.walletSubMenu.manualPayment',
        route: '/wallet/manual-payment',
        icon: 'icon-manual-payment',
        roles: ['FINANCE_MANAGER'],
      },
      {
        labelKey: 'menuItems.walletSubMenu.balanceReport',
        route: '/wallet/balance-report',
        icon: 'icon-report',
        roles: ['FINANCE_MANAGER', 'OPERATION_MANAGER', 'SALES_HEAD'],
      },
    ],
  },
  {
    labelKey: 'menuItems.billing',
    icon: 'icon-billing',
    roles: ['VENDOR_USER'],
    children: [
      {
        labelKey: 'menuItems.billingSubMenu.editProfile',
        route: '/billing/edit-profile',
        icon: 'icon-edit-profile',
      },
      {
        labelKey: 'menuItems.billingSubMenu.invoice',
        route: '/billing/invoice',
        icon: 'icon-invoice',
      },
    ],
  },
  {
    labelKey: 'menuItems.insights',
    route: '/insights',
    icon: 'icon-insights',
    roles: [
      'FINANCE_MANAGER',
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
    ],
    children: [
      {
        labelKey: 'menuItems.insightsSubMenu.overview',
        route: '/insights/overview',
        icon: 'icon-order-trend',
        roles: [
          'FINANCE_MANAGER',
          'OPERATION_MANAGER',
          'VENDOR_ACCOUNT_MANAGER',
          'SALES_HEAD',
        ],
      },
      {
        labelKey: 'menuItems.insightsSubMenu.churnReasons',
        route: '/insights/churn-reasons',
        icon: 'icon-churn-reasons',
        roles: [
          'FINANCE_MANAGER',
          'OPERATION_MANAGER',
          'VENDOR_ACCOUNT_MANAGER',
          'SALES_HEAD',
        ],
      },
      {
        labelKey: 'menuItems.insightsSubMenu.firstOrder',
        route: '/insights/first-order',
        icon: 'icon-first-order',
        roles: [
          'FINANCE_MANAGER',
          'OPERATION_MANAGER',
          'VENDOR_ACCOUNT_MANAGER',
          'SALES_HEAD',
        ],
      },
      {
        labelKey: 'menuItems.insightsSubMenu.affReferrals',
        route: '/insights/aff_referrals',
        icon: 'icon-aff-referrals',
        roles: [
          'FINANCE_MANAGER',
          'OPERATION_MANAGER',
          'VENDOR_ACCOUNT_MANAGER',
          'SALES_HEAD',
        ],
      },
      {
        labelKey: 'menuItems.insightsSubMenu.userReferrals',
        route: '/insights/user_referrals',
        icon: 'icon-user-referrals',
        roles: [
          'FINANCE_MANAGER',
          'OPERATION_MANAGER',
          'VENDOR_ACCOUNT_MANAGER',
          'SALES_HEAD',
        ],
      },
      {
        labelKey: 'menuItems.insightsSubMenu.zoneGrowth',
        route: '/insights/zone-growth',
        icon: 'icon-zone-growth',
        roles: [
          'FINANCE_MANAGER',
          'OPERATION_MANAGER',
          'VENDOR_ACCOUNT_MANAGER',
          'SALES_HEAD',
        ],
      },
    ],
  },

  {
    labelKey: 'menuItems.salesFunnel',
    route: '/order/sales-funnel',
    icon: 'icon-funnel',
    roles: ['SALES_HEAD', 'OPERATION_MANAGER', 'FINANCE_MANAGER'],
  },
  {
    labelKey: 'menuItems.rating',
    route: '/rating',
    icon: 'icon-star',
    roles: ['OPERATION_MANAGER', 'SALES_HEAD', 'FINANCE_MANAGER'],
  },
] as const;
