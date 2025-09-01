import { useAuthStore, useSharedStore, useVenderStore } from '@/store';
import { apiFetch } from '../lib/utils';
import { TypBranchWalletBalanceReportRes, TypeWalletTransactionHistoryRes } from '../types/report';
import { configService } from './app-config';

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
    return apiFetch(configService.reportServiceApiUrl() + url, {
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
  ): Promise<TypBranchWalletBalanceReportRes> {
    return apiFetch(configService.reportServiceApiUrl() + url, {
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
    let url = '/wallet/list?page_size=' + perPage;
    url = fromDate ? url + '&from_date=' + getFormattedDate(fromDate) : url;
    url = toDate ? url + '&to_date=' + getFormattedDate(toDate) : url;
    url = orderId ? url + '&txn_number=' + orderId : url;
    nextSetItemTotal?.forEach((element: any) => {
      url = url + '&NEXT_SET_ITEMS_TOKEN=' + element;
    });
    return this.getVenodrBarnchWalletUrl(url);
  },

  getVenodrBarnchWalletUrl(url: string) {
    const { user } = useAuthStore.getState();
    const { vendorId, branchId } = useVenderStore.getState();
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
    return apiFetch(configService.reportServiceApiUrl() + url, {
      method: 'GET',
    });
  },
};
