type RootTypeBranch = {
  data: TypeBranch;
};
type TypeBranch = {
  id: string;
  name: string;
  name_ar: null;
  code: null;
  mobile_number: string;
  main_branch: boolean;
  address: {
    area: string;
    block: string;
    street: string;
    area_id: number;
    block_id: number;
    landmark: string;
    latitude: string;
    longitude: string;
    street_id: number;
    paci_number: string;
  };
  vendor: {
    id: string;
    name: string;
    name_ar: null;
    cod_counter_type: number;
    code: null;
    vendor_affiliation: null;
    official_name: null;
    ref_type: number;
    ref_by: null;
    is_vendor_central_wallet_enabled: boolean;
    required_min_wallet_balance: string;
    account_manager_id: null;
    is_strategic_vendor: boolean;
    strategic_vendor_fee_share: number;
  };
  required_min_wallet_balance: string;
  branch_zone: [
    {
      tookan_region: null;
    },
  ];
};

export type TypeVender = {
  data: {
    id: string;
    name: string;
    name_ar: null;
    code: null;
    vendor_type: number;
    vendor_category: null;
    cod_counter_type: number;
    branches: TypeBranch[];
    vendor_affiliation: null;
    is_vendor_central_wallet_enabled: boolean;
    required_min_wallet_balance: string;
    account_manager: null;
  };
};

export type TypeWallet = {
  wallet_balance: number;
  recharged_count: number;
  is_vendor_central_wallet_enabled: boolean;
};

export type TypeWalletResponce = {
  data: TypeWallet;
};
