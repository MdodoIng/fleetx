import { useSharedStore } from '@/store';
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

  getBusyModeHistory(url: any): Promise<TypeBusyModeHistoryResponse> {
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

  getBusyModeHistoryUrl(
    page: number,
    perPage: number,
    fromDate?: Date,
    toDate?: Date
  ): string {
    const { getFormattedDate } = useSharedStore.getState();
    let url: string = `?page=${page}&page_size=${perPage}`;
    url = fromDate ? url + '&from_date=' + getFormattedDate(fromDate) : url;
    url = toDate ? url + '&to_date=' + getFormattedDate(toDate) : url;
    return url;
  },

  getZoneBusyModeHistoryUrl(
    page: number,
    perPage: number,
    zoneId?: string,
    fromDate?: Date,
    toDate?: Date
  ): string {
    const { getFormattedDate } = useSharedStore.getState();
    let url: string = `?page=${page}&page_size=${perPage}`;
    if (zoneId) {
      url = url + '&zone_id=' + zoneId;
    }
    url = fromDate ? url + '&from_date=' + getFormattedDate(fromDate) : url;
    url = toDate ? url + '&to_date=' + getFormattedDate(toDate) : url;
    return url;
  },
};
