import { AuthService } from '@/app/(not-protected)/auth/services/auth';
import { authenticate } from '@/app/(not-protected)/auth/services/user';
import { storageKeys } from '@/shared/lib/storageKeys';
import type {
  AuthRoot,
  AuthStore,
  UserLogin,
  UserRole,
} from '@/shared/types/auth';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useStore } from '.';

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
            const json = (await res.json()) as unknown as AuthRoot;
            localStorage.setItem(storageKeys.authAppToken, json.data.token);
            const tokenPayload = AuthService.getDecodedAccessToken(
              json.data.token
            );
            if (tokenPayload?.roles[0] === 'VENDOR_USER') {
              if (!tokenPayload.user.vendor?.sla_accepted) {
                // TODO: Open SLA acceptance dialog here if dialogService and SlaAcceptedComponent are available
                // Example:
                // dialogService?.open(SlaAcceptedComponent, {
                //   closeOnBackdropClick: false,
                //   closeOnEsc: false,
                // });
                return false;
              } else {
                useStore.setState(() => ({
                  vendorId: tokenPayload.user.vendor?.vendor_id ?? '',
                  branchId: tokenPayload.user.vendor?.branch_id ?? '',
                }));

                if (!tokenPayload.user.vendor?.password_reset_by_user) {
                  // AuthService.userId = tokenPayload.userId;
                  window.location.pathname = 'auth/reset-password';
                  return false;
                }
              }
            }
            const users = {
              token: json.data.token,
            };
            // if (json.data.token) {
            //    setUserContext
            //   this.storageService.addLocalStorage(
            //     storageConstants.user_context,
            //     JSON.stringify(users)
            //   );
            //   const date = new Date();
            //   this.storageService.addLocalStorage(
            //     storageConstants.refresh_time,
            //     date.toString()
            //   );
            //   if (this.cookieService.check(COOKIE_AFF_REF_CODE)) {
            //     this.cookieService.delete(COOKIE_AFF_REF_CODE);
            //   }
            //   this.freshChatService.initAfterLogin();
            // }
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
