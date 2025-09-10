export type UserRole =
  | 'OPERATION_MANAGER'
  | 'VENDOR_USER'
  | 'FINANCE_MANAGER'
  | 'VENDOR_ACCOUNT_MANAGER'
  | 'SALES_HEAD';

export interface AuthRoot {
  data: AuthData;
}

export interface AuthData {
  roles: UserRole[];
  token: string;
  user: User;
  user_id?: string;
}

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  supplier_admin: null;
  user_id: string;
  roles: UserRole[];
  vendor?: {
    vendor_id: string;
    branch_id: string;
    sla_accepted: boolean;
    password_reset_by_user: boolean;
  } | null;
}

interface AuthState {
  user: AuthData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  // login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

type UserLogin = {
  email: string;
  password: string;
  confirmPassword: string;
  oldPassword: string;
};

type ResetPassword = {
  password: string;
  confirm_password: string;
  user_id: string;
};

interface ChangePassword extends ResetPassword {
  old_password: string;
  user_id: string;
}

export interface DecodedToken {
  userId: string;
  user: User;
  roles: UserRole[];
  token: string;
  orig_iat?: number;
  exp?: number;
}


export interface TypeSingUpRequest  {
  name: string;
  business_name: string;
  business_type: number;
  email: string;
  full_name: string;
  password?: string;
  confirm_password?: string;
  is_business: boolean;
  aff_ref_code?: string;
  branches: {
    mobile_number: string;
    name: string;
    address: {
      landmark: string;
      area: string;
      area_id: number;
      block: string;
      block_id: number;
      street: string;
      street_id: number;
      latitude: string;
      longitude: string;
      building_id: number;
      building: string;
      paci_number: string;
    };
  };
  reference: null;
}