type UserRole =
  | 'VENDOR_USER'
  | 'OPERATION_MANAGER'
  | 'FINANCE_MANAGER'
  | 'VENDOR_ACCOUNT_MANAGER'
  | 'SALES_HEAD';
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;
