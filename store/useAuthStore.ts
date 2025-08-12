import { authenticate } from '@/app/(not-protected)/auth/services/user';
import { storageKeys } from '@/shared/lib/storageKeys';
import type {
  AuthRoot,
  AuthStore,
  User,
  UserLogin,
  UserRole,
} from '@/shared/types/auth';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      // Actions
      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true });

        const userLogin: UserLogin = {
          email: email,
          password: password,
          confirmPassword: '',
          oldPassword: '',
        };

        try {
          const res = await authenticate(userLogin);

          if (res.ok) {
            const json =  await res.json() as unknown as AuthRoot;
            console.log(json)
            localStorage.setItem(storageKeys.authAppToken, json.data.token);
            set({
              user: json.data,
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }

          set({ isLoading: false });
          return false;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      hasRole: (role: UserRole): boolean => {
        const { user } = get();
        if (!user) return false;

        // Role hierarchy: super_admin > admin > user
        const roleHierarchy: Record<UserRole, number> = {
          VENDOR_USER: 1,
          OPERATION_MANAGER: 2,
          FINANCE_MANAGER: 3,
          VENDOR_ACCOUNT_MANAGER: 4,
          SALES_HEAD: 5,
        };

        return Array.isArray(user.roles)
          ? user.roles.some(
              (userRole) => roleHierarchy[userRole] >= roleHierarchy[role]
            )
          : false;
      },

      hasAnyRole: (roles: UserRole[]): boolean => {
        const { hasRole } = get();
        return roles.some((role) => hasRole(role));
      },

      initializeAuth: () => {
        // This will be called on app initialization if needed
        const { user } = get();
        set({ isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure consistency after rehydration
          state.isAuthenticated = !!state.user;
          state.isLoading = false;
        }
      },
    }
  )
);
