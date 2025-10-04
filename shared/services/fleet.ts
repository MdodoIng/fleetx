import { apiFetch } from '../lib/utils';
import { appConfig } from './app-config';

export const fleetService = {
  getDriver(): Promise<TypeFleetDriverResponse> {
    return apiFetch(appConfig.fleetServiceApiUrl() + '/b2b-agents', {
      method: 'GET',
    });
  },

  getETA(request: any): Promise<any> {
    return apiFetch(appConfig.fleetServiceApiUrl() + '/etp', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  addZone(request: any): Promise<any> {
    return apiFetch(appConfig.fleetServiceApiUrl() + '/zone/create', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  getZoneList(): Promise<any> {
    return apiFetch(
      appConfig.fleetServiceApiUrl() + '/zone/list?page=1&page_size=100',
      {
        method: 'GET',
      }
    );
  },

  updateZone(request: any, id: string): Promise<any> {
    return apiFetch(appConfig.fleetServiceApiUrl() + '/zone/update/' + id, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  },

  deleteZone(id: string): Promise<any> {
    return apiFetch(appConfig.fleetServiceApiUrl() + '/zone/delete/' + id, {
      method: 'DELETE',
    });
  },

  getGeofence(): Promise<TypeGeofenceResponse> {
    return apiFetch(appConfig.fleetServiceApiUrl() + '/geofence/get', {
      method: 'GET',
    });
  },

  geofenceDisable(request: any): Promise<any> {
    return apiFetch(appConfig.fleetServiceApiUrl() + '/geofence/disable', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  geofenceEnable(request: any): Promise<any> {
    return apiFetch(appConfig.fleetServiceApiUrl() + '/geofence/enable', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  rechargeFirstTimeBlockConfig(request: any): Promise<any> {
    return apiFetch(
      appConfig.finServiceApiUrl() +
        '/wallet/recharge/first-time/block-config/set',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  },

  getBlockActivation(): Promise<TypeBlockActivationResponse> {
    return apiFetch(
      appConfig.finServiceApiUrl() +
        '/wallet/recharge/first-time/block-config/get',
      {
        method: 'GET',
      }
    );
  },
};
