import {
  useAuthStore,
  useOrderStore,
  useSharedStore,
  useVendorStore,
} from '@/store';
import { apiFetch } from '../lib/utils';

import {
  TypeBranchWalletBalanceReportRes,
  TypeDashboardDetailsResponse,
  TypeDashboardInsightResponse,
  TypeSalesFunnelRetentionResponse,
  TypeWalletTransactionHistoryRes,
  TypeZoneGrowthResponse,
} from '../types/report';
import { appConfig } from './app-config';

export const reportService = {
  getVendorBalanceUrl(
    perPage: number,
    vendorId: string,
    nextSetItemTotal: any
  ) {
    let url: string = '/vendor-wallet/balance/list?page_size=' + perPage;
    if (vendorId) {
      url = url + '&vendor_id=' + vendorId;
    }
    nextSetItemTotal?.forEach((element: any) => {
      url = url + '&NEXT_SET_ITEMS_TOKEN=' + element;
    });
    return url;
  },

  getVendorBalanceReport(
    url: string
  ): Promise<TypeWalletTransactionHistoryRes> {
    return apiFetch(appConfig.reportServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  getBranchWalletBalanceUrl(
    perPage: number,
    vendorId: string,
    branch_id: string,
    nextSetItemTotal: any
  ) {
    let url: string = '/branch-wallet/balance/list?page_size=' + perPage;
    if (vendorId) {
      url = url + '&vendor_id=' + vendorId;
    }
    if (branch_id) {
      url = url + '&branch_id=' + branch_id;
    }
    nextSetItemTotal?.forEach((element: any) => {
      url = url + '&NEXT_SET_ITEMS_TOKEN=' + element;
    });
    return url;
  },

  getBranchWalletBalanceReport(
    url: string
  ): Promise<TypeBranchWalletBalanceReportRes> {
    return apiFetch(appConfig.reportServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  getWalletHistoryUrl(
    perPage: number,
    orderId: string | null,
    fromDate: Date | null,
    toDate: Date | null,
    nextSetItemTotal: any[] | null
  ) {
    const { getFormattedDate } = useSharedStore.getState();
    let url = '/wallet/list?page_size=' + perPage + '&page=1';
    url = fromDate ? url + '&from_date=' + getFormattedDate(fromDate) : url;
    url = toDate ? url + '&to_date=' + getFormattedDate(toDate) : url;
    url = orderId ? url + '&txn_number=' + orderId : url;
    nextSetItemTotal?.forEach((element: any) => {
      url = url + '&NEXT_SET_ITEMS_TOKEN=' + element;
    });
    return this.getVendorBranchWalletUrl(url);
  },

  getVendorBranchWalletUrl(url: string) {
    const { user } = useAuthStore.getState();
    const { vendorId, branchId } = useVendorStore.getState();
    switch (user?.roles[0]) {
      case 'OPERATION_MANAGER':
      case 'VENDOR_ACCOUNT_MANAGER':
      case 'SALES_HEAD':
        if (vendorId) {
          url = url + '&vendor_id=' + vendorId;
          if (branchId) {
            url = url + '&branch_id=' + branchId;
          }
        }
        break;
      case 'FINANCE_MANAGER':
        if (vendorId) {
          url = url + '&vendor_id=' + vendorId;
          if (branchId) {
            url = url + '&branch_id=' + branchId;
          }
        }
        break;
      case 'VENDOR_USER':
        if (!user.user.vendor?.branch_id) {
          if (branchId) {
            url = url + '&branch_id=' + branchId;
          }
        }
        break;
    }
    return url;
  },

  getWalletHistory(url: string): Promise<TypeWalletTransactionHistoryRes> {
    return apiFetch(appConfig.reportServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  getDashboardUrl({
    selectedFromDate,
    selectedToDate,
    searchDriver,
  }: {
    selectedFromDate?: Date;
    selectedToDate?: Date;
    searchDriver?: string;
  }): string {
    const { getFormattedDate } = useSharedStore.getState();
    const { user } = useAuthStore.getState();
    const { vendorId, branchId } = useVendorStore.getState();

    const from = selectedFromDate ? getFormattedDate(selectedFromDate) : '';
    const to = selectedToDate ? getFormattedDate(selectedToDate) : '';

    let url = `/dashboard-data?from_date=${from}&to_date=${to}`;

    const currentUserRole = user?.roles?.[0];
    const hasBranchInToken = user?.user?.vendor?.branch_id;

    let showVendorBranchCard: boolean = false;

    switch (currentUserRole) {
      case 'OPERATION_MANAGER':
      case 'VENDOR_ACCOUNT_MANAGER':
      case 'SALES_HEAD':
      case 'FINANCE_MANAGER': // Corrected 'finance_manger' to 'FINANCE_MANAGER' based on UserRole enum
        showVendorBranchCard = true;
        if (vendorId) {
          url += `&vendor_id=${vendorId}`;
        }
        if (branchId) {
          url += `&branch_id=${branchId}`;
        }
        break;
      case 'VENDOR_USER':
        if (hasBranchInToken) {
          showVendorBranchCard = false;
        } else {
          showVendorBranchCard = true;
          if (branchId) {
            url += `&branch_id=${branchId}`;
          }
        }
        break;
      default:
        break;
    }

    if (searchDriver) {
      url += `&driver_id=${searchDriver}`;
    }

    return url;
  },

  getDashboardDetails(url: string): Promise<TypeDashboardDetailsResponse> {
    return apiFetch(appConfig.reportServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  getDashboardInsight(
    fromDate: Date | null,
    toDate: Date | null
  ): Promise<TypeDashboardInsightResponse> {
    const { getFormattedDate } = useSharedStore.getState();
    let url = '/performance/dashboard/insights';
    url = fromDate ? url + '?from_date=' + getFormattedDate(fromDate) : url;
    url = toDate ? url + '&to_date=' + getFormattedDate(toDate) : url;
    return apiFetch(appConfig.reportServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  getChurnReasonsInsights(fromDate: Date | null, toDate: Date | null) {
    const { getFormattedDate } = useSharedStore.getState();
    let url = '/funnel/retention/churn-reason/insights';
    url = fromDate ? url + '?from_date=' + getFormattedDate(fromDate) : url;
    url = toDate ? url + '&to_date=' + getFormattedDate(toDate) : url;
    return apiFetch(appConfig.reportServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  getFirstOrderList(
    page: number,
    perPage: number,
    fromDate: Date | null,
    toDate: Date | null
  ) {
    const { getFormattedDate } = useSharedStore.getState();
    let url = `/first-orders/list?page_size=${perPage}&page=${page}`;
    url = fromDate ? url + '&from_date=' + getFormattedDate(fromDate) : url;
    url = toDate ? url + '&to_date=' + getFormattedDate(toDate) : url;

    return apiFetch(appConfig.reportServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  getReferralsURLs(
    page: number,
    perPage: number,
    refBy: string,
    fromDate?: Date | null,
    toDate?: Date | null,
    ref_type = 1
  ): string {
    const { getFormattedDate } = useSharedStore.getState();
    const { selectedAffiliator } = useOrderStore.getState();

    let url = `/referral/report/orders?page_size=${perPage}&page=${page}&ref_type=${ref_type}`;

    if (fromDate) {
      url = url + '&from_date=' + getFormattedDate(fromDate);
    }
    if (toDate) {
      url = url + '&to_date=' + getFormattedDate(toDate);
    }
    if (refBy) {
      url = url + '&ref_by=' + refBy;
    } else if (selectedAffiliator) {
      url = url + '&ref_by=' + selectedAffiliator;
    }
    return url;
  },

  getReferrals(url: string): Promise<any> {
    return apiFetch(appConfig.reportServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  getZoneGrowth(
    region_id: number,
    year: number
  ): Promise<TypeZoneGrowthResponse> {
    let url = '/zone/growth/insight';
    const queryParams = [];

    if (region_id) {
      queryParams.push(`region_id=${region_id}`);
    }
    if (year) {
      queryParams.push(`year=${year}`);
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    return apiFetch(appConfig.reportServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  getSalesFunnelActivation(): Promise<any> {
    return apiFetch(
      appConfig.reportServiceApiUrl() + '/funnel/activation/users',
      {
        method: 'GET',
      }
    );
  },

  getSalesFunnelRetention(): Promise<TypeSalesFunnelRetentionResponse> {
    return apiFetch(
      appConfig.reportServiceApiUrl() + '/funnel/retention/users',
      {
        method: 'GET',
      }
    );
  },

  getSalesFunnelRetention2(): Promise<TypeSalesFunnelRetentionResponse> {
    return apiFetch(
      appConfig.reportServiceApiUrl() +
        '/funnel/retention/no-order-has-wallet/users',
      {
        method: 'GET',
      }
    );
  },

  getSalesFunnelReactivationUsers() {
    return apiFetch(
      appConfig.reportServiceApiUrl() + '/funnel/reactivation/users',
      {
        method: 'GET',
      }
    );
  },

  getSalesFunnelActivationInsight(): Promise<any> {
    return apiFetch(
      appConfig.reportServiceApiUrl() + '/funnel/activation/insights',
      {
        method: 'GET',
      }
    );
  },
  getSalesFunnelRetentionInsight(): Promise<any> {
    return apiFetch(
      appConfig.reportServiceApiUrl() + '/funnel/retention/insights',
      {
        method: 'GET',
      }
    );
  },

  getSalesFunnelRetention2Insight(): Promise<any> {
    return apiFetch(
      appConfig.reportServiceApiUrl() +
        '/funnel/retention/no-order-has-wallet/insights',
      {
        method: 'GET',
      }
    );
  },

  getSalesFunnelReactivationInsight(): Promise<any> {
    return apiFetch(
      appConfig.reportServiceApiUrl() + '/funnel/reactivation/insights',
      {
        method: 'GET',
      }
    );
  },

  downloadInvoiceReport(
    vendorId: any,
    branchId: any,
    month: any,
    year: any
  ): Promise<{ data: { invoice_file: string } }> {
    const url =
      '/vendor/invoice/get/' +
      vendorId +
      '/branch/' +
      branchId +
      '?month=' +
      month +
      '&year=' +
      year;
    return apiFetch(appConfig.reportServiceApiUrl() + url, {
      method: 'GET',
    });
  },
};
