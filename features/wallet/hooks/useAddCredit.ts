// features/wallet/hooks/useAddCredit.ts
'use client';

import { checkBlockActivation } from '@/shared/services';
import { paymentService } from '@/shared/services/payment';
import { useVenderStore } from '@/store';
import { useWalletStore } from '@/store/useWalletStore';
import * as React from 'react';
import { toast } from 'sonner'; // or your own toaster

export function useAddCredit() {
  const { isCentralWalletEnabled } = useWalletStore.getState();

  const { vendorId, branchId, isVendorAdmin } = useVenderStore.getState();

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

  // === Entry point (Angular: addCredit) ===
  const handleAddCredit = async () => {
    if (!vendorId) {
      toast.warning('Please select a vendor');
      return;
    }
    try {
      const checkBlockActRes = await checkBlockActivation(vendorId!, branchId!);

      if (checkBlockActRes.data.blocked) {
        toast.error('Blocked by system policy');
        return;
      }

      if (isCentralWalletEnabled) {
        openDialog({ isMultiplePayment: false, isCentral: true });
      } else {
        if (isVendorAdmin && !branchId) {
          openDialog({ isMultiplePayment: true, isCentral: false });
        } else {
          if (!branchId) {
            toast.warning('Please select a branch');
            return;
          }
          openDialog({ isMultiplePayment: false, isCentral: false });
        }
      }
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to verify status');
    }
  };

  const submitAddCredit = async (amount: number) => {
    if (!vendorId) throw new Error('vendorId missing');

    await handleAddCredit();

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
