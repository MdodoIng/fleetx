'use client';

import { useRouter } from 'next/navigation';

import { useAuthStore, useSharedStore, useVendorStore } from '@/store';
import { associateFoodics } from '@/shared/services';
import { routes } from '@/shared/constants/routes';

export function useRedirectToHome() {
  const router = useRouter();
  const { foodicsIsAlreadyConnected, foodicsReference, lastPathname } =
    useSharedStore();
  const { user } = useAuthStore();
  const { vendorId, branchId } = useVendorStore();

  const redirectToHomeLogic = async () => {
    if (lastPathname) {
      const cleanLastPathname = lastPathname.startsWith('/')
        ? lastPathname
        : `/${lastPathname}`;

      let allowedRoute = Object.values(routes).find(
        (route) => route.path === cleanLastPathname
      );

      if (!allowedRoute) {
        allowedRoute = Object.values(routes).find((route) => {
          const routeParts = route.path.split('/');
          const pathParts = cleanLastPathname.split('/');

          if (routeParts.length !== pathParts.length) return false;

          return routeParts.every((part, index) => part === pathParts[index]);
        });
      }

      if (allowedRoute) {
        if (allowedRoute.roles) {
          if (user?.roles?.some((role) => allowedRoute.roles!.includes(role))) {
            router.push(cleanLastPathname);
          } else {
            console.warn(
              `User lacks required roles for ${cleanLastPathname}:`,
              {
                required: allowedRoute.roles,
                userRoles: user?.roles,
              }
            );
            router.push('/order/create');
          }
        } else {
          router.push(cleanLastPathname);
        }
      } else {
        console.warn(`Route not found: ${cleanLastPathname}`);
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
