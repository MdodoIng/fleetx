'use client';

import { useRouter } from 'next/navigation';

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
      router.push('/order/create');
      return;
    }

    if (branchId && foodicsReference) {
      router.push('/order/create');
      return;
    }

    if (vendorId && foodicsReference) {
      await associateFoodicsToVendorAdmin();
      return;
    }

    router.push('/order/create');
  };

  const associateFoodicsToVendorAdmin = async () => {
    try {
      await associateFoodics({
        vendorId,
        reference: foodicsReference,
      });
      router.push('/order/create');
    } catch (error) {
      console.error('Failed to associate Foodics:', error);
      router.push('/order/create');
    }
  };

  return redirectToHomeLogic;
}
