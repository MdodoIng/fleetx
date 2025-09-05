import { useSharedStore } from '@/store';
import { apiFetch } from '../lib/utils';
import {
  TypeBalanceAlertReq,
  TypeCreateDebitMashkorReq,
  TypeInitiateReq,
  TypeManualPaymentHistoryReportRes,
  TypePaymentAddReq,
  TypePrepareMashkorReq,
  TypeWalletNotifyBalanceRes,
} from '../types/payment';
import { AppConfigService, configService } from './app-config';

export const paymentService = {
  confirmWalletNotifyBalance(request: TypeBalanceAlertReq): Promise<any> {
    return apiFetch(
      configService.paymentServiceApiUrl() +
        '/wallet/settings/balance-alert/add',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },
  getWalletNotifyBalance(
    vendorId: string,
    branchId: string
  ): Promise<TypeWalletNotifyBalanceRes> {
    let url = '/' + vendorId;
    if (branchId) {
      url = url + '/branch/' + branchId;
    }
    url = url + '/wallet/settings/balance-alert/get';
    return apiFetch(configService.paymentServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  addFleetxCredit(request: TypePaymentAddReq & any) {
    return apiFetch(
      AppConfigService.paymentServiceApiUrl() + '/add/mashkor-credit',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },

  getManualPaymentHistoryReportUrl(
    page: number,
    perPage: number,
    fromDate: Date | null,
    toDate: Date | null,
    vendorId: string,
    branchId: string,
    type: string | any
  ) {
    const { getFormattedDate } = useSharedStore.getState();
    let url = '/mashkor/list?page=' + page + '&page_size=' + perPage;
    url = fromDate ? url + '&from_date=' + getFormattedDate(fromDate) : url;
    url = toDate ? url + '&to_date=' + getFormattedDate(toDate) : url;
    if (type) {
      url = url + '&operation_type=' + type;
    }
    if (vendorId) {
      url = url + '&vendor_id=' + vendorId;
      if (branchId) {
        url = url + '&branch_id=' + branchId;
      }
    }
    return url;
  },

  getManualPaymentHistoryReport(
    url: string
  ): Promise<TypeManualPaymentHistoryReportRes> {
    return apiFetch(configService.paymentServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  getPaymentHistoryReportUrl(
    page: number,
    perPage: number,
    fromDate: Date | null,
    toDate: Date | null,
    invoicePaymentId: string,
    selectedVendor: string
  ) {
    const { getFormattedDate } = useSharedStore.getState();
    let url = '/list?page=' + page + '&page_size=' + perPage;
    url = invoicePaymentId
      ? url + '&payment_invoice_id=' + invoicePaymentId
      : url;
    url = fromDate ? url + '&from_date=' + getFormattedDate(fromDate) : url;
    url = toDate ? url + '&to_date=' + getFormattedDate(toDate) : url;
    if (selectedVendor) {
      url = url + '&vendor_id=' + selectedVendor;
    }
    return url;
  },

  getPaymentHistoryReport(url: string): Promise<any> {
    return apiFetch(configService.paymentServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  initiate(request: TypeInitiateReq): Promise<any> {
    return apiFetch(configService.paymentServiceApiUrl() + '/initiate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  prepareMashkorCredit(request: TypePrepareMashkorReq): Promise<any> {
    return apiFetch(
      configService.paymentServiceApiUrl() + '/prepare/mashkor-credit',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },

  prepareMashkorDebit(request: TypePrepareMashkorReq): Promise<any> {
    return apiFetch(
      configService.paymentServiceApiUrl() + '/prepare/mashkor-debit',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },

  addMashkorCredit(request: TypeCreateDebitMashkorReq): Promise<any> {
    return apiFetch(
      configService.paymentServiceApiUrl() + '/add/mashkor-credit',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },

  addMashkorDebit(request: TypeCreateDebitMashkorReq): Promise<any> {
    return apiFetch(
      configService.paymentServiceApiUrl() + '/add/mashkor-debit',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },

  getBalanceOfBranches(vendorId: string): Promise<any> {
    const url = '/wallet/vendor/branches/balance/' + vendorId;
    return apiFetch(configService.paymentServiceApiUrl() + url, {
      method: 'GET',
    });
  },
};
