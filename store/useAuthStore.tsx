import { storageKeys } from '@/shared/lib/storageKeys';
import { configService } from '@/shared/services/app-config';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

import { COOKIE_AFF_REF_CODE } from '@/shared/constants/storageConstants';

import { isMounted } from '@/shared/lib/hooks';

import { authenticate } from '@/shared/services/user';
import type {
  AuthRoot,
  DecodedToken,
  UserLogin,
  UserRole,
} from '@/shared/types/auth';
import { useStorageStore } from './useStorageStore';

const userApiUrl = configService.userServiceApiUrl();

type AuthState = {
  user: AuthRoot['data'] | null;
  userId?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  getDecodedAccessToken: (token?: string | null) => DecodedToken | undefined;
  triggerRefreshToken: () => Promise<void>;
  isAuthenticatedCheck: () => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  getAccessTokenTime: () => { orgTime: number; exp: number } | null;
};

function getInitialAuthState(): boolean {
  if (!isMounted) return false;
  useAuthStore.setState({ isLoading: true });
  try {
    const userStr = localStorage.getItem(storageKeys.userContext);
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    const decoded: any = jwtDecode(user.token);
    const isTokenValid = decoded.exp && Date.now() / 1000 < decoded.exp;

    if (isTokenValid) {
      useAuthStore.setState({
        user: decoded,
        isAuthenticated: true,
      });
    } else {
      useAuthStore().refreshToken()
    }
    useAuthStore.setState({ isLoading: false });
    return isTokenValid;
  } catch {
    useAuthStore.setState({ isLoading: false });
    return false;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  hasRole: (role) => {
    const { user } = get();

    const roleHierarchy: Record<UserRole, number> = {
      VENDOR_USER: 1,
      OPERATION_MANAGER: 2,
      FINANCE_MANAGER: 3,
      VENDOR_ACCOUNT_MANAGER: 4,
      SALES_HEAD: 5,
    };

    if (!user || !Array.isArray(user?.roles)) return false;

    if (!user.roles || user.roles.length === 0) {
      return false;
    }

    // Assuming the user has only one role for now; adjust logic if needed
    const userRole = user.roles[0];

    if (!(userRole in roleHierarchy) || !(role in roleHierarchy)) {
      return false; // Handle cases where the role is not defined in the hierarchy
    }

    return roleHierarchy[userRole] >= roleHierarchy[role];
  },

  hasAnyRole: (roles: UserRole[]): boolean => {
    const { hasRole } = get();
    return roles.some((role) => hasRole(role));
  },
  login: async (email, password) => {
    set({ isLoading: true });

    const userLogin: UserLogin = {
      email,
      password,
      confirmPassword: '',
      oldPassword: '',
    };

    try {
      const res = await authenticate(userLogin);

      if (res.ok) {
        const json = (await res.json()) as AuthRoot;
        localStorage.setItem(storageKeys.authAppToken, json.data.token);

        const tokenPayload = get().getDecodedAccessToken(json.data.token);
        if (tokenPayload?.roles[0] === 'VENDOR_USER') {
          if (!tokenPayload.user.vendor?.sla_accepted) {
            set({ isLoading: false });
            return false;
          } else {
            useStorageStore.setState({
              vendorId: tokenPayload.user.vendor?.vendor_id,
              branchId: tokenPayload.user.vendor?.branch_id,
            });

            if (!tokenPayload.user.vendor?.password_reset_by_user) {
              set({ userId: tokenPayload.userId });
              window.location.pathname = 'auth/reset-password';
              return false;
            }
          }
        }

        localStorage.setItem(
          storageKeys.userContext,
          JSON.stringify({ token: json.data.token })
        );
        localStorage.setItem(storageKeys.refreshTime, new Date().toString());

        if (Cookies.get(COOKIE_AFF_REF_CODE)) {
          Cookies.remove(COOKIE_AFF_REF_CODE);
        }

        set({
          user: json.data,
          isAuthenticated: true,
          isLoading: false,
        });

        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (err) {
      console.error('Login error:', err);
      set({ isLoading: false });
      return false;
    }
    return true;
  },

  logout: () => {
    Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();
    set({ user: null, isAuthenticated: false });
  },

  refreshToken: async () => {
    const tokenPayload = get().getDecodedAccessToken();
    if (!tokenPayload) return;

    const res = await fetch(userApiUrl + '/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenPayload.token }),
    });

    if (!res.ok) throw new Error('Failed to refresh token');

    const data = await res.json();
    localStorage.setItem(
      storageKeys.userContext,
      JSON.stringify({ token: data.data.token })
    );
    localStorage.setItem(storageKeys.refreshTime, new Date().toString());
  },

  getDecodedAccessToken: (token) => {
    if (!token) {
      const userStr = localStorage.getItem(storageKeys.userContext);
      if (!userStr) {
        get().logout();
        return;
      }
      token = JSON.parse(userStr).token;
    }
    try {
      const decoded: any = jwtDecode(token!);
      return {
        userId: decoded.user_id,
        user: decoded.user,
        roles: decoded.roles,
        token: token ?? '',
        orig_iat: decoded.orig_iat,
        exp: decoded.exp,
      };
    } catch {
      get().logout();
    }
  },

  getAccessTokenTime(): { orgTime: number; exp: number } | null {
    if (typeof localStorage === 'undefined') return null;

    const userStr = localStorage.getItem(storageKeys.userContext);
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      const decoded: any = jwtDecode(user.token);
      return { orgTime: decoded.orig_iat, exp: decoded.exp };
    } catch {
      return null;
    }
  },
  triggerRefreshToken: async () => {
    const refreshTime = localStorage.getItem(storageKeys.refreshTime);
    if (refreshTime) {
      const refreshDate = new Date(refreshTime);
      const currentTime = new Date();
      const minute =
        Math.abs(currentTime.getTime() - refreshDate.getTime()) / 60000;
      if (Math.round(minute) >= 30) {
        try {
          await get().refreshToken();
        } catch (error: any) {
          if (
            error.message?.includes('Signature has expired') ||
            error.message?.includes('Refresh has expired')
          ) {
            get().logout();
          }
        }
      }
    }
  },

  isAuthenticatedCheck: () => {
    set({ isLoading: true });
    const isAuth = getInitialAuthState();
    set({ isAuthenticated: isAuth });
    set({ isLoading: false });

    return isAuth;
  },
}));
