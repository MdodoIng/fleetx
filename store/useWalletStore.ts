import { vendorService } from '@/shared/services/vender';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSharedStore } from './sharedStore';
import { useVenderStore } from './useVenderStore';
import { useAuthStore } from './useAuthStore';
import { getSuperSaverPromotion } from '@/shared/services';
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

async function getFunSuperSaverPromotion() {
  const { vendorId, branchId, selectedBranch, selectedVendor } =
    useVenderStore.getState();
  const {
    setValue,
    successOrdersCount,
    isAchievedSuperSaver,
    isActiveSuperSaver,
  } = useWalletStore.getState();

  try {
    const res = await getSuperSaverPromotion(
      vendorId! || selectedVendor?.id!,
      branchId! || selectedBranch?.id!
    );
    if (res.data) {
      setValue('isAchievedSuperSaver', res.data.achieved_supersaver);
      setValue('isActiveSuperSaver', res.data.active);
      setValue('successOrdersCount', res.data.success_orders_count);
      setValue('activeOrdersCount', res.data.active_orders_count);
      setValue(
        'superSaverReachOrderCount',
        res.data.super_saver_reach_order_count
      );
      setValue(
        'balanceOrdersCount',
        res.data.super_saver_reach_order_count - res.data.success_orders_count
      );
      setValue(
        'balanceHours',
        res.data.full_day
          ? getTimeRemaining()
          : getTimeDiffrence(
              res.data.start_time,
              res.data.end_time,
              res.data.next_day
            )
      );

      setValue(
        'successOrdersCountProgressBar',
        res.data.super_saver_reach_order_count !== 0
          ? (successOrdersCount * 100) / res.data.super_saver_reach_order_count
          : 0
      );
      setSuperSaverWalletInfoMessage(
        res.data.delivery_fee_rule_type,
        res.data.delivery_fee_rule
      );
    }
    if (isAchievedSuperSaver && isActiveSuperSaver) {
      setPricingRule(
        res.data.delivery_fee_rule_type,
        res.data.delivery_fee_rule
      );
    } else {
      getVendorPricingRule();
    }
  } catch (err: any) {
    console.error(err.error.message);
  }
}

async function getVendorPricingRule() {
  const { vendorId, branchId, selectedBranch, selectedVendor } =
    useVenderStore.getState();

  try {
    const res = await vendorService.getVendorPricingRule(
      selectedVendor?.id || vendorId!,
      selectedBranch?.id || branchId!
    );
    if (res.data) {
      setPricingRule(res.data.rule_type, res.data.rule_definition);
    }
  } catch (err: any) {
    // Assuming a similar error handling pattern to other functions in the file.
    // The original code used a `sharedService` which is not defined in this scope.
    console.error(
      'Failed to get vendor pricing rule:',
      err.error?.message || err
    );
  }
}

function setPricingRule(ruleType: number, data: any) {
  const { setValue } = useWalletStore.getState();

  const deliveryRuleSlabs = {
    first: {},
    slabs: [],
    last: {},
    linear: {},
    ruleType: ruleType,
  };

  switch (ruleType) {
    case 1: // Linear
      setValue('baseFare', data.base_fare);
      setValue('farePerkm', data.fare_per_km);
      setValue('baseFareDistance', data.base_fare_distance);
      setValue('baseFareDistancePlus', data.base_fare_distance + 1);
      setValue('totalSum', data.base_fare + data.fare_per_km);
      break;

    case 4: // Slab with linear
      if (data?.slabs) {
        deliveryRuleSlabs.first = data.slabs[0];
        deliveryRuleSlabs.slabs = data.slabs.slice(1);
        deliveryRuleSlabs.linear = data?.linear;
      }
      break;

    case 2: // Slab
      if (data?.slabs && data.slabs.length > 0) {
        const lastSlab = data.slabs[data.slabs.length - 1];
        if (lastSlab?.above_distance) {
          deliveryRuleSlabs.first = data.slabs[0];
          deliveryRuleSlabs.slabs = data.slabs.slice(1, -1);
          deliveryRuleSlabs.last = lastSlab;
        }
      }
      break;

    case 3: // Flat rate
      setValue('flatRate', data.fare);
      setValue('areaFare', data?.area_fare);
      break;
  }

  if (ruleType === 2 || ruleType === 4) {
    setValue('deliveryRuleSlabs', deliveryRuleSlabs);
  }
}

function setSuperSaverWalletInfoMessage(type: any, deliveryFeeRule: any) {
  const { setValue } = useWalletStore.getState();
  const { appConstants } = useSharedStore.getState();

  let fareRuleType = type;
  let superSaverBaseFareDistance;
  let superSaverBaseFare;
  let superSaverWalletInfoMessages;
  let superSaverAchivedWalletMessages;
  const { balanceOrdersCount } = useWalletStore.getState();

  switch (type) {
    case 1:
      superSaverBaseFareDistance = deliveryFeeRule?.base_fare_distance;
      superSaverBaseFare = deliveryFeeRule.base_fare;
      break;
    case 2:
      superSaverBaseFareDistance = deliveryFeeRule?.slabs[0].max_distance;
      superSaverBaseFare = deliveryFeeRule?.slabs[0].fare;
      break;
    case 3:
      superSaverBaseFareDistance = 0;
      superSaverBaseFare = deliveryFeeRule.fare;
      break;
    case 4:
      superSaverBaseFareDistance = deliveryFeeRule?.slabs[0].max_distance;
      superSaverBaseFare = deliveryFeeRule.slabs[0].fare;
      break;
  }

  if (type == 3) {
    // flat rate
    // superSaverWalletInfoMessages = translate.instant('screens.wallet.superSaver.push1', {
    //   balanceOrdersCount: balanceOrdersCount,
    //   superSaverBaseFare: superSaverBaseFare,
    //   currencyCode: currencyCode,
    // });
    // superSaverAchivedWalletMessages = translate.instant('screens.wallet.superSaver.nowOnwards1', {
    //   superSaverBaseFare: superSaverBaseFare,
    //   currencyCode: appConstants?.currency,
    // });
  } else {
    // superSaverWalletInfoMessages = translate.instant('screens.wallet.superSaver.push2', {
    //   balanceOrdersCount: balanceOrdersCount,
    //   superSaverBaseFare: superSaverBaseFare,
    //   currencyCode: appConstants?.currency,
    //   superSaverBaseFareDistance: superSaverBaseFareDistance,
    // });
    // superSaverAchivedWalletMessages = translate.instant(
    //   'screens.wallet.superSaver.nowOnwards2',
    //   {
    //     superSaverBaseFare: superSaverBaseFare,
    //     currencyCode: appConstants?.currency,
    //     superSaverBaseFareDistance: superSaverBaseFareDistance,
    //   }
    // );
  }

  setValue('superSaverWalletInfoMessages', superSaverWalletInfoMessages);
  setValue('superSaverAchivedWalletMessages', superSaverAchivedWalletMessages);
}

function getTimeDiffrence(
  startTime: string,
  endTime: string,
  nextDay: boolean
) {
  if (startTime && endTime) {
    let timeStart = new Date();
    let timeEnd = new Date();
    if (nextDay) {
      timeEnd.setDate(timeEnd.getDate() + 1);
    }
    let value_end = endTime.split(':');

    timeEnd.setHours(
      parseInt(value_end[0]),
      parseInt(value_end[1]),
      parseInt(value_end[2]),
      0
    );
    const total = timeEnd.getTime() - timeStart.getTime();
    return Math.floor((total / (1000 * 60 * 60)) % 24);
  }
}

function getTimeRemaining() {
  let timeStart = new Date();
  var timeEnd = new Date();
  timeEnd.setHours(23, 59, 59, 999);
  const total = timeEnd.getTime() - timeStart.getTime();
  return Math.floor((total / (1000 * 60 * 60)) % 24);
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
              getSuperSaverPromotion();
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
