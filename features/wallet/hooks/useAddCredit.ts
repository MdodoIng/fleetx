'use client';

import { checkBlockActivation } from '@/shared/services';
import { paymentService } from '@/shared/services/payment';
import {
  TypeCreateDebitMashkorReq,
  TypeInitiateReq,
  TypePrepareMashkorReq,
} from '@/shared/types/payment';
import { TypeBranch } from '@/shared/types/vendor';
import { useAuthStore, useVendorStore } from '@/store';
import {
  getVendorWalletBalanceInit,
  useWalletStore,
} from '@/store/useWalletStore';
import { Dispatch, useState, SetStateAction } from 'react';
import { toast } from 'sonner';
import { TypeAddCreditDebitformSchema } from '../validations/paymentForm';
import { UseFormReturn } from 'react-hook-form';
import { getUserLocale } from '@/shared/services/locale';

type BranchData = {
  branch: TypeBranch;
  currentAmount: number;
  rechargeAmount: number;
};

export function useAddCredit() {
  const {
    isCentralWalletEnabled,
    setValue,
    isMultiplePayment,
    isAddCreditDebit,
    prepareMashkor,
  } = useWalletStore.getState();

  const {
    vendorId,
    branchId,
    isVendorAdmin,
    selectedBranch,
    selectedVendor,
    setValue: setValueVendorStore,
  } = useVendorStore.getState();
  const { user } = useAuthStore.getState();

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    isMultiplePayment: boolean;
    isCentral: boolean;
  }>({ open: false, isMultiplePayment: false, isCentral: false });

  const openDialog = (opts: {
    isMultiplePayment: boolean;
    isCentral: boolean;
  }) => setDialogState({ open: true, ...opts });

  const closeDialog = () => setDialogState((s) => ({ ...s, open: false }));

  const handlePrepareMashkor = ({
    setIsOpen,
  }: {
    setIsOpen: Dispatch<SetStateAction<number | undefined>>;
  }) => {
    if (!prepareMashkor) return;
    if (
      prepareMashkor.amount &&
      prepareMashkor.branch &&
      prepareMashkor.vendor &&
      prepareMashkor.txnNumber &&
      prepareMashkor.type
    ) {
      if (
        selectedBranch?.id !== prepareMashkor.branch.id ||
        selectedVendor?.id !== prepareMashkor.vendor.id
      ) {
        useVendorStore.setState({
          branchId: prepareMashkor.branch.id,
          vendorId: prepareMashkor.vendor.id,
          selectedBranch: prepareMashkor.branch,
          selectedVendor: prepareMashkor.vendor,
        });
      }
      setIsOpen(2);
    }
  };

  const handleAddCredit = async () => {
    if (!vendorId || (!selectedVendor?.id && isAddCreditDebit)) {
      toast.warning('Please select a vendor');
      return false;
    }

    if (isAddCreditDebit) {
      if (
        (vendorId! && branchId!) ||
        (selectedBranch?.id && selectedVendor?.id!)
      ) {
        setValue('isDisableAddCredit', true);
      }
    }

    try {
      const checkBlockActRes = await checkBlockActivation(
        vendorId! || selectedVendor?.id,
        branchId! || selectedBranch?.id
      );

      if (checkBlockActRes.data.blocked) {
        toast.error('Blocked by system policy');
        setValue('isShowAddCreditButton', false);
        return false;
      }

      if (isCentralWalletEnabled) {
        setValue('isMultiplePayment', false);
        openDialog({ isMultiplePayment: false, isCentral: true });
      } else {
        if (isVendorAdmin) {
          if (!selectedBranch?.id || !branchId) {
            setValue('isMultiplePayment', true);
            return false;
          } else {
            setValue('isMultiplePayment', false);
          }
        } else {
          setValue('isMultiplePayment', false);
        }
      }

      return true;
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to verify status');
      return false;
    }
  };

  const submitAddCredit = async (amount: number | BranchData[]) => {
    if (!vendorId) throw new Error('vendorId missing');

    const locale = (await getUserLocale()) ?? 'en';
    const payment =
      typeof amount === 'number'
        ? [
          {
            amount: amount,
            branch_id: branchId || selectedBranch!.id,
          },
        ]
        : amount.map((item) => {
          return {
            amount: item.rechargeAmount,
            branch_id: item.branch.id!,
          };
        });

    const totalRecharge = payment?.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0
    );

    const reqoust: TypeInitiateReq = isCentralWalletEnabled
      ? {
        vendor_id: vendorId!,
        amount: parseFloat(
          typeof amount === 'number' ? amount.toFixed(2) : '0.00'
        ),
        language: locale?.toUpperCase(),
      }
      : {
        amount: totalRecharge,
        branch_payments: payment,
        language: locale?.toUpperCase(),
        vendor_id: vendorId!,
      };

    const res = await paymentService.initiate(reqoust);
    console.log(res);

    toast.success('Amount credited successfully');
  };

  const submitCreditDebitPrepare = async (
    form: UseFormReturn<TypeAddCreditDebitformSchema>
  ) => {
    if (!selectedBranch && !selectedVendor) throw new Error('Branch missing');

    if (await form.trigger()) {
      const valuesForm = form.watch();
      const reqoust: TypePrepareMashkorReq = {
        amount: valuesForm.amount,
        note: valuesForm.note || '',
        branch_id: selectedBranch?.id || '',
        vendor_id: selectedVendor?.id || '',
      };

      const res =
        valuesForm.paymentType === 'credit'
          ? await paymentService.prepareMashkorCredit(reqoust)
          : await paymentService.prepareMashkorDebit(reqoust);
      console.log(res);

      setValue('prepareMashkor', {
        type: valuesForm.paymentType,
        amount: valuesForm.amount,
        txnNumber: res.data.txn_number,
        branch: selectedBranch,
        vendor: selectedVendor,
      });
      toast.success('Amount credited successfully');

      if (isCentralWalletEnabled) {
      }
    }
  };

  const submitCreditDebitConformed = async ({
    setIsOpen,
  }: {
    setIsOpen: Dispatch<SetStateAction<number | undefined>>;
  }) => {
    if (!prepareMashkor) {
      toast.error('Please prepare the transaction first');
      return;
    }

    const reqoust: TypeCreateDebitMashkorReq = {
      amount: prepareMashkor.amount,
      txn_number: prepareMashkor.txnNumber,
    };

    try {
      if (prepareMashkor.type === 'credit') {
        await paymentService.addMashkorCredit(reqoust);
        await getVendorWalletBalanceInit();
        toast.success('Amount credited successfully');
      } else {
        await paymentService.addMashkorDebit(reqoust);
        await getVendorWalletBalanceInit();
        toast.success('Amount debited successfully');
      }
      setValue('prepareMashkor', undefined);
      setIsOpen(undefined);
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to confirm transaction');
    }
  };

  return {
    handleAddCredit,
    dialogOpen: dialogState.open,
    dialogIsMultiple: dialogState.isMultiplePayment,
    dialogIsCentral: dialogState.isCentral,
    setDialogOpen: (open: boolean) => setDialogState((s) => ({ ...s, open })),
    submitAddCredit,
    submitCreditDebitPrepare,
    submitCreditDebitConformed,
    handlePrepareMashkor,
  };
}
