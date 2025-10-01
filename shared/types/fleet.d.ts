interface TypeFleetDriverResponse {
  data: {
    agents: Array<{
      fleet_id: number;
      name: string;
      is_available: number;
      status: number;
    }>;
  };
}

interface TypeGeofenceResponse {
  data: [
    {
      name: 'COURIERS_GEOFENCE_ENABLED';
      value: '1';
    },
    {
      name: 'MASHKOR_APP_GEOFENCE_ENABLED';
      value: '1';
    },
  ];
}

interface TypeBlockActivationResponse {
  data: {
    enabled: false;
    message: string;
  };
}
