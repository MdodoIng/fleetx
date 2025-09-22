'use client';

import { useRouter } from 'next/navigation';

import { useAuthStore, useSharedStore, useVenderStore } from '@/store';
import { associateFoodics } from '@/shared/services';
import { routes } from '@/shared/constants/routes';

export function useRedirectToHome() {
  const router = useRouter();
  const { foodicsIsAlreadyConnected, foodicsReference, lastPathname } =
    useSharedStore();
  const { user } = useAuthStore();
  const { vendorId, branchId } = useVenderStore();

  const redirectToHomeLogic = async () => {
    if (lastPathname) {
      const allowedRoute = Object.values(routes).find(
        (route) => route.path === lastPathname
      );
      if (
        allowedRoute &&
        allowedRoute.roles?.some((role) => user?.roles?.includes(role))
      ) {
        router.push(lastPathname);
      } else {
        router.push('/order/create');
      }
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
