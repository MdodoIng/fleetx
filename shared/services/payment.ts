import { apiFetch } from '../lib/utils';
import {
  TypeBalanceAlertReq,
  TypePaymentAddReq,
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
};
