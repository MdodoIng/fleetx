export type FunnelType = { id: number; name: string };
export type Zone = { id: string; region_name: string };
export type User = { id: string; first_name: string };
export type FunnelRow = {
  user_id: string;
  user_name: string;
  region_id?: string;
  account_manager?: string;
  funnel_stage: number;
  churn_reason?: { reason: string };
};
export type SalesFunnelResponse = { data: FunnelRow[] };
