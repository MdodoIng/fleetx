import { apiFetch } from '../lib/utils';
import { appConfig } from './app-config';


export const fleetService = {
  getDriver(): Promise<TypeFleetDriverResponse> {
    return apiFetch(appConfig.fleetServiceApiUrl() + '/b2b-agents', {
      method: 'GET',
    });
  },
};
