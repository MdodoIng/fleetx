import { apiFetch } from '../lib/utils';
import {
  TypeBalanceAlertReq,
  TypeWalletNotifyBalanceRes,
} from '../types/payment';
import { configService } from './app-config';

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
};
