
'use client';

import { useRouter } from 'next/navigation';
import { MAIN_MENU } from '@/shared/constants/routes';
import { associateFoodics, useSharedStore } from '@/store/sharedStore';

export function useRedirectToHome() {
  const router = useRouter();
  const { foodicsIsAlreadyConnected, foodicsReference, branchId, vendorId } =
    useSharedStore();

  const redirectToHomeLogic = async () => {
    if (foodicsIsAlreadyConnected) {
      router.push(MAIN_MENU.FODDICS_ON_BOARD.LINK);
      return;
    }

    if (branchId && foodicsReference) {
      router.push(MAIN_MENU.FODDICS_ON_BOARD.LINK);
      return;
    }

    if (vendorId && foodicsReference) {
      await associateFoodicsToVendorAdmin();
      return;
    }

    // Default fallback
    router.push(MAIN_MENU.DASHBOARD.LINK);
  };

  const associateFoodicsToVendorAdmin = async () => {
    try {
      await associateFoodics({
        vendorId,
        reference: foodicsReference,
      });
      router.push(MAIN_MENU.DASHBOARD.LINK);
    } catch (error) {
      console.error('Failed to associate Foodics:', error);
      router.push(MAIN_MENU.DASHBOARD.LINK);
    }
  };

  return redirectToHomeLogic;
}
