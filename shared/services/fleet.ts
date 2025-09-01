import { apiFetch } from '../lib/utils';
import { configService } from './app-config';

export const fleetService = {
  getDriver() {
    return apiFetch(configService.fleetServiceApiUrl() + '/b2b-agents', {
      method: 'GET',
    });
  },
};
