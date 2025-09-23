import { vendorService } from '@/shared/services/vender';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useVenderStore } from './useVenderStore';
import { useAuthStore } from './useAuthStore';
import { TypeAddCreditDebitformSchema } from '@/features/wallet/validations/paymentForm';
import { TypeBranch, TypeVender } from '@/shared/types/vender';

export async function getVendorWalletBalanceInit() {
  const { branchId, vendorId, selectedVendor, selectedBranch } =
    useVenderStore.getState();
  const { setValue } = useWalletStore.getState();

  const effectiveVendorId = selectedVendor?.id || vendorId;
  const effectiveBranchId = selectedBranch?.id || branchId;

  if (!effectiveVendorId || !effectiveBranchId) {
    console.warn(
      'Missing effective vendor or branch ID for getVendorWalletBalanceInit. Aborting API call.'
    );
    return;
  }

  try {
    const res = await vendorService.getVendorWalletBalance(
      effectiveVendorId,
      effectiveBranchId
    );
    if (res) {
      setValue('walletBalance', res.data.wallet_balance.toString());
      setValue(
        'isRechargedOrWalletBalance',
        (
          res.data.recharged_count > 0 || res.data.wallet_balance !== 0
        ).toString()
      );
    }
  } catch (err: any) {
    console.error(err.error?.message || err.message || err);
  }
}

export function toShowAddCreditButton() {
  const { isCentralWalletEnabled, setValue, successOrdersCount } =
    useWalletStore.getState();
  const { branchId } = useVenderStore.getState();
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
  isAchievedSuperSaver: any;
  isActiveSuperSaver: any;
  successOrdersCount: any;
  activeOrdersCount: any;
  superSaverReachOrderCount: any;
  balanceOrdersCount: any;
  balanceHours: any;
  successOrdersCountProgressBar: any;
  superSaverWalletInfoMessages: any;
  superSaverAchivedWalletMessages: any;

  baseFare: any;
  farePerkm: any;
  baseFareDistance: any;
  baseFareDistancePlus: any;
  totalSum: any;
  flatRate: any;
  areaFare: any;
  deliveryRuleSlabs: any;
  isMultiplePayment: boolean;
  prepareMashkor:
  | {
    type: TypeAddCreditDebitformSchema['paymentType'] | undefined;
    txnNumber: number;
    amount: number;
    branch: TypeBranch | undefined;
    vendor: TypeVender | undefined;
  }
  | undefined;
}

export interface WalletActions {
  setValue: <K extends keyof WalletState>(
    key: K,
    value: WalletState[K]
  ) => void;
  getCentralWalletEnabled: () => {};
  clearAll: () => void;
  checkWallet: () => void;
  setTabBasedOnRole: () => Promise<void>;
}

const initialState: WalletState = {
  isCentralWalletEnabled: false,
  walletBalance: 0,
  isRechargedOrWalletBalance: 0,
  isShowAddCreditButton: false,
  isShowUserMessageWhenBranchSelected: false,
  isDisableAddCredit: true,
  isAddCreditDebit: false,
  isAchievedSuperSaver: false,
  isActiveSuperSaver: false,
  successOrdersCount: 0,
  activeOrdersCount: 0,
  superSaverReachOrderCount: 0,
  balanceOrdersCount: 0,
  balanceHours: null,
  successOrdersCountProgressBar: 0,
  superSaverWalletInfoMessages: '',
  baseFare: null,
  farePerkm: null,
  baseFareDistance: null,
  baseFareDistancePlus: null,
  totalSum: null,
  flatRate: null,
  areaFare: null,
  deliveryRuleSlabs: null,
  superSaverAchivedWalletMessages: '',
  isMultiplePayment: false,
  prepareMashkor: undefined,
};

export const useWalletStore = create<WalletState & WalletActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setValue: (key: keyof WalletState, value: any) => set({ [key]: value }),
      clearAll: () => set({ ...initialState }),

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
        const { vendorId, selectedVendor } = useVenderStore.getState();
        const { user } = useAuthStore.getState();

        if (!selectedVendor?.id || !vendorId) return;
        try {
          const res = await vendorService.getVendorInfo(
            selectedVendor?.id! || vendorId!
          );

          if (res.data) {
            set({
              isCentralWalletEnabled: res.data.is_vendor_central_wallet_enabled,
            });
            const { isCentralWalletEnabled } = get();
            if (
              isCentralWalletEnabled ||
              res.data.is_vendor_central_wallet_enabled
            ) {
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

      setTabBasedOnRole: async () => {
        const { user } = useAuthStore.getState();

        switch (user?.roles[0]) {
          case 'FINANCE_MANAGER':
            set({
              isDisableAddCredit: false,
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
              isDisableAddCredit: false,
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
              isDisableAddCredit: true,
            });

            if (user.user.vendor?.branch_id) {
              useVenderStore.setState({
                isVendorAdmin: false,
              });
              getVendorWalletBalanceInit();
            } else {
              useVenderStore.setState({
                isVendorAdmin: true,
              });
              set({
                walletBalance: '-',
              });
            }
            get().getCentralWalletEnabled();
            break;
        }
        await getVendorWalletBalanceInit();
      },
    }),
    {
      name: 'wallet-storage',
    }
  )
);
