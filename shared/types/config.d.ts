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
