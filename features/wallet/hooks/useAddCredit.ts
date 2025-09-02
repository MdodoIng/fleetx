// features/wallet/hooks/useAddCredit.ts
'use client';

import { checkBlockActivation } from '@/shared/services';
import { paymentService } from '@/shared/services/payment';
import { useAuthStore, useVenderStore } from '@/store';
import { useWalletStore } from '@/store/useWalletStore';
import * as React from 'react';
import { toast } from 'sonner'; // or your own toaster

export function useAddCredit() {
  const { isCentralWalletEnabled, setValue } = useWalletStore.getState();

  const { vendorId, branchId, isVendorAdmin, selectedBranch } =
    useVenderStore.getState();
  const { user } = useAuthStore.getState();

  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    isMultiplePayment: boolean;
    isCentral: boolean;
  }>({ open: false, isMultiplePayment: false, isCentral: false });

  const openDialog = (opts: {
    isMultiplePayment: boolean;
    isCentral: boolean;
  }) => setDialogState({ open: true, ...opts });

  const closeDialog = () => setDialogState((s) => ({ ...s, open: false }));

  const handleAddCredit = async () => {
    if (!vendorId) {
      toast.warning('Please select a vendor');
      return;
    }
    try {
      const checkBlockActRes = await checkBlockActivation(vendorId!, branchId!);

      if (checkBlockActRes.data.blocked) {
        toast.error('Blocked by system policy');
        setValue('isShowAddCreditButton', false);
        return false;
      }

      if (isCentralWalletEnabled) {
        openDialog({ isMultiplePayment: false, isCentral: true });
      } else {
        if (isVendorAdmin) {
          setValue('isMultiplePayment', true);
          openDialog({ isMultiplePayment: true, isCentral: false });
          if (branchId || selectedBranch?.id) {
            setValue('isMultiplePayment', false);
            toast.warning('Please select a branch');
            return;
          }
        } else {
          if (!branchId || !selectedBranch?.id) {
            toast.warning('Please select a branch');
            return;
          }
          setValue('isMultiplePayment', false);
          openDialog({ isMultiplePayment: false, isCentral: false });
        }
      }
      return true;
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to verify status');
      return false;
    }
  };

  const submitAddCredit = async (amount: number) => {
    if (!vendorId) throw new Error('vendorId missing');

    if (isCentralWalletEnabled) {
    }
    await paymentService.addFleetxCredit({
      vendorId,
      branchId,
      amount,
      isMultiplePayment: dialogState.isMultiplePayment,
      isCentralWalletEnabled: dialogState.isCentral,
    });
    toast.success('Amount credited successfully');
  };

  return {
    handleAddCredit,
    dialogOpen: dialogState.open,
    dialogIsMultiple: dialogState.isMultiplePayment,
    dialogIsCentral: dialogState.isCentral,
    setDialogOpen: (open: boolean) => setDialogState((s) => ({ ...s, open })),
    submitAddCredit,
  };
}
