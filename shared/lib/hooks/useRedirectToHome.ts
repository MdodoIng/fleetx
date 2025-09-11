'use client';

import { useRouter } from 'next/navigation';
import { MAIN_MENU } from '@/shared/constants/routes';
import { useSharedStore, useVenderStore } from '@/store';
import { associateFoodics } from '@/shared/services';

export function useRedirectToHome() {
  const router = useRouter();
  const { foodicsIsAlreadyConnected, foodicsReference, lastPathname } =
    useSharedStore();
  const { vendorId, branchId } = useVenderStore();

  const redirectToHomeLogic = async () => {
    if (lastPathname) {
      router.push(lastPathname);
      return;
    }
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

    router.push('order/create');
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
