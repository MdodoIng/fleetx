type RootTypeBranch = {
  data: TypeBranch[];
};

type RootTypeBranchByBranchId = {
  data: TypeBranch;
};

export type TypeBranch = {
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

export type TypeVenderRes = {
  data: TypeVender;
};

export type TypeWallet = {
  wallet_balance: number;
  recharged_count: number;
  is_vendor_central_wallet_enabled: boolean;
};

export type TypeWalletResponce = {
  data: TypeWallet;
};

export type TypeVenderListMainBranch = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  name: string;
  name_ar: null;
  code: null;
  mobile_number: string;
  active: boolean;
  main_branch: boolean;
  created_by: string;
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
  required_min_wallet_balance: string;
  source: number;
  vendor: string;
};

export type TypeVenderListItem = {
  id: string;
  account_manager: null;
  vendor_affiliation: null;
  created_at: string;
  name: string;
  business_name: string;
  onboarding_type: number;
  company_legal_name: null;
  official_name: null;
  is_vendor_central_wallet_enabled: boolean;
  main_branch: TypeVenderListMainBranch;
};

export type TypeVenderList = TypeVenderListItem[];

export type TypeVenderListRes = {
  data: TypeVenderList;
  NEXT_SET_ITEMS_TOKEN: number[];
};

export type TypeEditVenderReq = {
  branches: [
    {
      id: string;
      name: string;
      name_ar: string | null;
      code: string | null;
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
        name_ar: string | null;
        cod_counter_type: number;
        code: string | null;
        vendor_affiliation: string | null;
        official_name: string | null;
        ref_type: number;
        ref_by: string | null;
        is_vendor_central_wallet_enabled: boolean;
        required_min_wallet_balance: string;
        account_manager_id: string | null;
        is_strategic_vendor: boolean;
        strategic_vendor_fee_share: number;
      };
      required_min_wallet_balance: string;
      branch_zone: [
        {
          tookan_region: {
            region_id: string;
          } | null;
        },
      ];
    },
  ];
  id: string;
  name: string;
  name_ar: string | null;
  cod_counter_type: number;
};

export type TypeAddVenderReq = {
  branches: [
    {
      address: {
        area: string;
        area_id: number;
        block: string;
        block_id: number;
        street: string;
        street_id: number;
        building: string;
        building_id: number;
        paci_number: string;
        landmark: string;
        latitude: string;
        longitude: string;
      };
      name: string;
      name_ar: string | null;
      code: string | null;
      mobile_number: string;
      main_branch: boolean;
    },
  ];
  name: string;
  name_ar: string | null;
  code: string | null;
  vendor_type: number;
  cod_counter_type: number;
};

export const TypeVendorType = {
  B2C_Vendor: 1,
  B2B_Vendor: 2,
  B2C_and_B2B_Vendor: 3,
} as const;
