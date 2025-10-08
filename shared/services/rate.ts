import { apiFetch } from '../lib/utils';
import { TypeGetDashBoardResponse } from '../types/rate';
import { appConfig } from './app-config';

export const rateService = {
  pickUpRate(request: any) {
    return apiFetch(
      appConfig.rateServiceApiUrl() +
        '/order/pickup/rate/' +
        request.order_number,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },

  firstOrderPickUpRate(request: any) {
    return apiFetch(
      appConfig.rateServiceApiUrl() +
        '/first/order/pickup/rate/' +
        request.order_number,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },

  pickUpRateFromNotify(request: any, groupId: any) {
    return apiFetch(
      appConfig.rateServiceApiUrl() + '/order/group/pickup/rate/' + groupId,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },

  deliveryRate(request: any) {
    return apiFetch(appConfig.rateServiceApiUrl() + '/order/delivery/rate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  gropuPickUpRate(request: any) {
    return apiFetch(appConfig.rateServiceApiUrl() + '/order/group/pickup', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  getPickUpRate(request: any) {
    return apiFetch(
      appConfig.rateServiceApiUrl() + '/order/pickup/' + request,
      {
        method: 'GET',
      }
    );
  },

  getDashBoard(): Promise<TypeGetDashBoardResponse> {
    return apiFetch(appConfig.rateServiceApiUrl() + '/dashboard', {
      method: 'GET',
    });
  },

  getBuddyList(page: any, perPage: any, search: any) {
    return apiFetch(
      appConfig.rateServiceApiUrl() +
        '/buddy/list?page=' +
        page +
        '&page_size=' +
        perPage +
        (search ? '&search=' + search : ''),
      {
        method: 'GET',
      }
    );
  },

  getBuddiesDetailedList(type: any, page: any, perPage: any) {
    const url =
      '/improvement-type/buddy/list?improvement_type=' +
      type +
      '&page=' +
      page +
      '&page_size=' +
      perPage;
    return apiFetch(appConfig.rateServiceApiUrl() + url, {
      method: 'GET',
    });
  },

  downloadBuddiesDetails(url: any) {
    return apiFetch(appConfig.rateServiceApiUrl() + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  },

  getBuddyDetailsByDriverId(driverId: any) {
    return apiFetch(
      appConfig.rateServiceApiUrl() + '/buddy/improvements/' + driverId,
      {
        method: 'GET',
      }
    );
  },
};
