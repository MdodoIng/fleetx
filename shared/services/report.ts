import { apiFetch } from '../lib/utils';
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

  getVendorBalanceReport(url: string) {
    return apiFetch(configService.reportServiceApiUrl() + url, {
      method: 'GET',
    });
  },
};
