import { vendorService } from '@/shared/services/vender';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSharedStore } from './sharedStore';
import { useVenderStore } from './useVenderStore';
import { useAuthStore } from './useAuthStore';
import { fa, tr } from 'zod/v4/locales';
import { use } from 'react';

export async function getVendorWalletBalanceInit() {
  const { branchId, vendorId } = useVenderStore.getState();
  const { setValue } = useWalletStore.getState();

  try {
    const res = await vendorService.getVendorWalletBalance(
      vendorId!,
      branchId!
    );
    if (res) {
      setValue('walletBalance', res.data.wallet_balance.toString());
      setValue(
        'isRechargedOrWalletBalance',
        res.data.recharged_count > 0 || res.data.wallet_balance != 0
      );
    }
  } catch (err: any) {
    console.log('danger', err.error.message);
  }
}

export function toShowAddCreditButton() {
  const { isCentralWalletEnabled, setValue } = useWalletStore.getState();
  const { branchId, vendorId } = useVenderStore.getState();
  const { user } = useAuthStore.getState();

  if (isCentralWalletEnabled) {
    if (!branchId) {
      setValue('isShowAddCreditButton', true);
      setValue('isShowUserMessageWhenBranchSelected', false);
    } else {
      setValue('isShowAddCreditButton', false);
      setValue('isShowUserMessageWhenBranchSelected', true);
    }
  } else {
    setValue('isShowAddCreditButton', true);
    setValue('isShowUserMessageWhenBranchSelected', false);
  }

  if (user?.roles.includes('VENDOR_USER')) {
    if (user.user.vendor?.branch_id) {
      setValue('isShowUserMessageWhenBranchSelected', false);
    }
  } else if (
    user?.roles.includes('OPERATION_MANAGER') ||
    user?.roles.includes('VENDOR_ACCOUNT_MANAGER') ||
    user?.roles.includes('SALES_HEAD')
  ) {
    setValue('isShowUserMessageWhenBranchSelected', false);
  }
}

export interface WalletState {
  isCentralWalletEnabled: boolean;
  walletBalance: string | number;
  isRechargedOrWalletBalance: string | number;
  isShowAddCreditButton: boolean;
  isShowUserMessageWhenBranchSelected: boolean;
  isDisableAddCredit: boolean;
  isAddCreditDebit: boolean;
}

export interface WalletActions {
  setValue: (key: keyof WalletState, value: any) => void;
  getCentralWalletEnabled: () => {};
  clearAll: () => void;
  checkWallet: () => void;
  setTabBasedOnRole: () => void;
}

export const useWalletStore = create<WalletState & WalletActions>()(
  persist(
    (set, get) => ({
      isCentralWalletEnabled: false,
      walletBalance: 0,
      isRechargedOrWalletBalance: 0,
      isShowAddCreditButton: false,
      isShowUserMessageWhenBranchSelected: false,
      isDisableAddCredit: true,
      isAddCreditDebit: false,

      setValue: (key: keyof WalletState, value: any) => set({ [key]: value }),
      clearAll: () => {
        set({
          isCentralWalletEnabled: false,
          walletBalance: 0,
          isRechargedOrWalletBalance: 0,
          isShowAddCreditButton: false,
          isShowUserMessageWhenBranchSelected: false,
        });
      },

      checkWallet: () => {
        const { user } = useAuthStore.getState();
        if (
          user?.roles.includes('FINANCE_MANAGER') ||
          user?.roles.includes('SALES_HEAD') ||
          user?.roles.includes('VENDOR_ACCOUNT_MANAGER') ||
          user?.roles.includes('OPERATION_MANAGER')
        ) {
          get().getCentralWalletEnabled();
        }
      },

      getCentralWalletEnabled: async () => {
        const { vendorId } = useVenderStore.getState();
        const { user } = useAuthStore.getState();

        try {
          const res = await vendorService.getVendorInfo(vendorId!);

          if (res.data) {
            set({
              isCentralWalletEnabled: res.data.is_vendor_central_wallet_enabled,
            });
            const { isCentralWalletEnabled } = get();
            if (isCentralWalletEnabled) {
              getVendorWalletBalanceInit();
              toShowAddCreditButton();
            } else {
              if (
                user?.roles.includes('FINANCE_MANAGER') ||
                user?.roles.includes('VENDOR_ACCOUNT_MANAGER') ||
                user?.roles.includes('SALES_HEAD') ||
                user?.roles.includes('OPERATION_MANAGER')
              ) {
                get().clearAll();
              } else {
                if (!user?.user.vendor?.branch_id) {
                  toShowAddCreditButton();
                } else {
                  toShowAddCreditButton();
                }
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      },

      setTabBasedOnRole: () => {
        const { user } = useAuthStore.getState();
        switch (user?.roles[0]) {
          case 'FINANCE_MANAGER':
            set({
              isDisableAddCredit: true,
              walletBalance: '-',
              isAddCreditDebit: true,
            });
            useVenderStore.setState({
              isVendorAdmin: false,
            });
            break;
          case 'OPERATION_MANAGER':
          case 'VENDOR_ACCOUNT_MANAGER':
          case 'SALES_HEAD':
            set({
              isDisableAddCredit: true,
              walletBalance: '-',
              isAddCreditDebit: false,
            });
            useVenderStore.setState({
              isVendorAdmin: false,
            });
            break;
          case 'VENDOR_USER':
            set({
              isAddCreditDebit: false,
              isDisableAddCredit: false,
            });

            if (user.user.vendor?.branch_id) {
              useVenderStore.setState({
                isVendorAdmin: false,
              });
              getVendorWalletBalanceInit();

              // this.getSuperSaverPromation();
            } else {
              useVenderStore.setState({
                isVendorAdmin: false,
              });
              set({
                walletBalance: '-',
              });
            }
            get().getCentralWalletEnabled();
            break;
        }
      },
    }),
    {
      name: 'wallet-storage',
    }
  )
);
