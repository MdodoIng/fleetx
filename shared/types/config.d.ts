interface TypeOpTime {
  start_time: string;
  end_time: string;
  full_day_operational: boolean | undefined;
  next_day: boolean;
}

interface TypeSetWarningMessageRequest {
  message: string | undefined;
  enabled: boolean;
}

interface TypeBusyModeHistory {
  id: string;
  mode_type: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  warned_at: string | null;
  activated_at: string | null;
  expired_at: string | null;
  active: boolean;
  is_revoked: boolean;
  reason: string;
  activated_by: string | null;
  duration: string | null;
  unassigned_count: number;
  assigned_count: number;
  busy_drivers_count: number;
  free_drivers_count: number;
  offline_drivers_count: number;
}

interface TypeBusyModeHistoryResponse {
  data: TypeBusyModeHistory[];
  count: number;
}
