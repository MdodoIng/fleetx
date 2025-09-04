export type TypeWalletTransactionHistoryRes = {
  data: [
    {
      balance: {
        balance_amount: string;
      };
      updated_at: string;
      txn_number: string;
      txn_amount: string;
      txn_type: number;
      txn_at: string;
      operation_type: number;
      vendor_id: string;
      branch_id: string;
      initial_amount: string;
      tax_amount: string;
      wallet_type: number;
      source: number;
      delivery_model: number;
      delivery_distance: string;
    },
  ];
  NEXT_SET_ITEMS_TOKEN: [number, string] | null;
};

export type TypBranchWalletBalanceReportRes = {
  data: [
    {
      created_at: string;
      name: string;
      required_min_wallet_balance: string;
      vendor: {
        name: string;
        business_name: string;
        onboarding_type: number;
      };
      wallet_balance: string;
    },
  ];
  NEXT_SET_ITEMS_TOKEN: [number, string] | null;
};

interface TypeDashboardDetailsResponse {
  data: {
    total_cash_collected: number;
    total_delivery_fees: number;
    total_failed_orders: number;
    payment_methods: {
      cod: number;
      online: number;
    };
    delivery_models: {
      on_demand: number;
      grouped: number;
      bulk: number;
    };
  };
}

export interface TypeZoneGrowth {
  id: string;
  zone: {
    region_id: string;
    region_name: string;
  };
  created_at: string | null;
  active_branches_count: number;
  inactive_branches_count: number;
  not_ordered_branches_count: number;
  all_branches_count: number;
  month: number;
  year: number;
}

export interface TypeZoneGrowthResponce {
  data: TypeZoneGrowth[];
}
