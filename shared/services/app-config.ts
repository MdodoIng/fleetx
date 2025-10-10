export const appConfig = {
  _getApiServiceUrl(path: string): string {
    return `${process.env.API_GATEWAY_BASE_URL}/${path}`;
  },

  userServiceApiUrl(): string {
    return this._getApiServiceUrl('user');
  },

  vendorServiceApiUrl(): string {
    return this._getApiServiceUrl('vendor');
  },

  orderServiceApiUrl(): string {
    return this._getApiServiceUrl('order');
  },

  fleetServiceApiUrl(): string {
    return this._getApiServiceUrl('fleet');
  },

  reportServiceApiUrl(): string {
    return this._getApiServiceUrl('report');
  },

  paymentServiceApiUrl(): string {
    return this._getApiServiceUrl('payment');
  },

  notificationServiceApiUrl(): string {
    return this._getApiServiceUrl('notification');
  },

  cashCollectionServiceApiUrl(): string {
    return this._getApiServiceUrl('cash-collection');
  },

  rateServiceApiUrl(): string {
    return this._getApiServiceUrl('rating');
  },

  finServiceApiUrl(): string {
    return this._getApiServiceUrl('fin');
  },

  googleKey(): string {
    return process.env.GOOGLE_KEY!;
  },
};
