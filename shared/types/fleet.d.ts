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
