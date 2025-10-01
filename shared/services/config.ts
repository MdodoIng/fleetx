import { apiFetch } from '../lib/utils';
import { TypeOperationTimeApiResponse } from '../types/notification';
import { appConfig } from './app-config';

export const configService = {
  create(opTime: TypeOpTime): Promise<TypeOperationTimeApiResponse> {
    return apiFetch(
      appConfig.orderServiceApiUrl() + '/config/operation/timing/create',
      {
        method: 'POST',
        body: JSON.stringify(opTime),
      }
    );
  },

  getBusyModeHistory(url: any) {
    return apiFetch(
      appConfig.orderServiceApiUrl() + '/config/busy-mode/list' + url,
      {
        method: 'GET',
      }
    );
  },

  update(
    opTime: TypeOpTime,
    id: string
  ): Promise<TypeOperationTimeApiResponse> {
    return apiFetch(
      appConfig.orderServiceApiUrl() + '/config/operation/timing/update/' + id,
      {
        method: 'PUT',
        body: JSON.stringify(opTime),
      }
    );
  },

  setWarningMessage(payload: TypeSetWarningMessageRequest) {
    return apiFetch(
      appConfig.orderServiceApiUrl() + '/order-screen-msg/update',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },

  getOnlyZoneBusyModeHistory(url: any) {
    return apiFetch(
      appConfig.orderServiceApiUrl() + '/zone-busy-mode/history' + url,
      {
        method: 'GET',
      }
    );
  },

  getZoneBusyModeHistory(url: string) {
    const history = apiFetch(
      appConfig.orderServiceApiUrl() + '/zone-busy-mode/history' + url,
      {
        method: 'GET',
      }
    );
    const zone = apiFetch(appConfig.orderServiceApiUrl() + '/zone/list', {
      method: 'GET',
    });
    return Promise.all([history, zone]);
  },
};
