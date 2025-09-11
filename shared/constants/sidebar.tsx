import { SUB_MENU } from './routes';
import NewOrderIcon from '../components/icons/layout/NewOrderIcon';
import { FC } from 'react';
import { SidebarIconType } from '../components/icons/layout';
import { UserRole } from '../types/user';

export interface MenuItem {
  labelKey: string;
  route?: string;
  roles?: UserRole[];
  icon?: SidebarIconType;
  children?: MenuItem[];
}

export const APP_SIDEBAR_MENU: MenuItem[] = [
  {
    labelKey: 'layout.menuItems.dashboard',
    route: '/dashboard',
    icon: 'activeOrders',
    roles: ['OPERATION_MANAGER', 'SALES_HEAD', 'FINANCE_MANAGER'],
  },
  {
    labelKey: 'layout.menuItems.order',

    children: [
      {
        labelKey: 'layout.menuItems.orderSubMenu.newOrder',
        route: SUB_MENU.NEW_ORDER_OLD.LINK,
        icon: 'newOrder',
      },
      {
        labelKey: 'layout.menuItems.orderSubMenu.bulkOrder',
        route: '/order/bulk',
        icon: 'newOrder',
      },
      {
        labelKey: 'layout.menuItems.orderSubMenu.liveOrder',
        route: '/order/live',
        icon: 'activeOrders',
      },
      {
        labelKey: 'layout.menuItems.orderSubMenu.history',
        route: '/order/history',
        icon: 'history',
      },
      {
        labelKey: 'layout.menuItems.orderSubMenu.bulkInsights',
        route: '/order/bulk-insights',
        icon: 'bulkInsights',
      },
    ],
  },
  {
    labelKey: 'layout.menuItems.vendor',
    roles: [
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
      'FINANCE_MANAGER',
    ],
    children: [
      {
        labelKey: 'layout.menuItems.vendorSubMenu.vendorList',
        route: '/vendor/list',
        icon: 'history',
      },
      {
        labelKey: 'layout.menuItems.vendorSubMenu.addNewVendor',
        route: '/vendor/add',
        icon: 'history',
      },
      {
        labelKey: 'layout.menuItems.vendorSubMenu.users',
        route: '/vendor/users',
        icon: 'history',
      },
      {
        labelKey: 'layout.menuItems.vendorSubMenu.accountManager',
        route: '/vendor/account-manager',
        icon: 'history',
        roles: ['SALES_HEAD'],
      },
    ],
  },
  {
    labelKey: 'layout.menuItems.wallet',
    children: [
      {
        labelKey: 'layout.menuItems.walletSubMenu.myWallet',
        route: '/wallet/overview',
        icon: 'myWallet',
      },
      {
        labelKey: 'layout.menuItems.walletSubMenu.history',
        route: '/wallet/history',
        icon: 'history',
      },
      {
        labelKey: 'layout.menuItems.walletSubMenu.paymentHistory',
        route: '/wallet/payment-history',
        icon: 'history',
        roles: ['FINANCE_MANAGER'],
      },
      {
        labelKey: 'layout.menuItems.walletSubMenu.manualPayment',
        route: '/wallet/manual-payment',
        icon: 'myWallet',
        roles: ['FINANCE_MANAGER'],
      },
      {
        labelKey: 'layout.menuItems.walletSubMenu.balanceReport',
        route: '/wallet/balance-report',
        icon: 'myWallet',
        roles: ['FINANCE_MANAGER', 'OPERATION_MANAGER', 'SALES_HEAD'],
      },
    ],
  },
  {
    labelKey: 'layout.menuItems.billing',
    roles: ['VENDOR_USER'],

    children: [
      {
        labelKey: 'layout.menuItems.billingSubMenu.editProfile',
        route: '/billing/edit-profile',
        icon: 'history',
      },
      {
        labelKey: 'layout.menuItems.billingSubMenu.invoice',
        route: '/billing/invoice',
        icon: 'history',
      },
    ],
  },
  {
    labelKey: 'layout.menuItems.insights',

    roles: [
      'FINANCE_MANAGER',
      'OPERATION_MANAGER',
      'VENDOR_ACCOUNT_MANAGER',
      'SALES_HEAD',
    ],
    children: [
      {
        labelKey: 'layout.menuItems.insightsSubMenu.overview',
        route: '/insights/overview',
        icon: 'history',
        roles: [
          'FINANCE_MANAGER',
          'OPERATION_MANAGER',
          'VENDOR_ACCOUNT_MANAGER',
          'SALES_HEAD',
        ],
      },
      {
        labelKey: 'layout.menuItems.insightsSubMenu.churnReasons',
        route: '/insights/churn-reasons',
        icon: 'history',
        roles: [
          'FINANCE_MANAGER',
          'OPERATION_MANAGER',
          'VENDOR_ACCOUNT_MANAGER',
          'SALES_HEAD',
        ],
      },
      {
        labelKey: 'layout.menuItems.insightsSubMenu.firstOrder',
        route: '/insights/first-order',
        icon: 'history',
        roles: [
          'FINANCE_MANAGER',
          'OPERATION_MANAGER',
          'VENDOR_ACCOUNT_MANAGER',
          'SALES_HEAD',
        ],
      },
      {
        labelKey: 'layout.menuItems.insightsSubMenu.affReferrals',
        route: '/insights/aff_referrals',
        icon: 'history',
        roles: [
          'FINANCE_MANAGER',
          'OPERATION_MANAGER',
          'VENDOR_ACCOUNT_MANAGER',
          'SALES_HEAD',
        ],
      },
      {
        labelKey: 'layout.menuItems.insightsSubMenu.userReferrals',
        route: '/insights/user_referrals',
        icon: 'history',
        roles: [
          'FINANCE_MANAGER',
          'OPERATION_MANAGER',
          'VENDOR_ACCOUNT_MANAGER',
          'SALES_HEAD',
        ],
      },
      {
        labelKey: 'layout.menuItems.insightsSubMenu.zoneGrowth',
        route: '/insights/zone-growth',
        icon: 'history',
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
    labelKey: 'layout.menuItems.others',
    roles: ['VENDOR_USER'],
    children: [
      {
        labelKey: 'layout.menuItems.othersSubMenu.integrations',
        route: '/integrations',
        icon: 'integrations',
        roles: ['VENDOR_USER'],
      },
    ],
  },

  {
    labelKey: 'layout.menuItems.salesFunnel',
    route: '/order/sales-funnel',
    roles: ['SALES_HEAD', 'OPERATION_MANAGER', 'FINANCE_MANAGER'],
    icon: 'history',
  },
  {
    labelKey: 'layout.menuItems.rating',
    route: '/rating',
    roles: ['OPERATION_MANAGER', 'SALES_HEAD', 'FINANCE_MANAGER'],
    icon: 'history',
  },
] as const;
