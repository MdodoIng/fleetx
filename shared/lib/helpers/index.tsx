'use client';
import { TypePickUpSchema } from '@/features/orders/validations/order';
import { useOrderStore } from '@/store/useOrderStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { APP_SIDEBAR_MENU, routes } from '@/shared/constants/routes';
import { UserRole } from '@/shared/types/user';
import { MenuItem, RouteConfig } from '@/shared/types/constants';
import { useAuthStore } from '@/store';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function makeLoc(
  type: string,
  name: string,
  id: any,
  landmarkValues: TypePickUpSchema
): Locs {
  // Validate required parameters
  if (!type || !name || id === null || id === undefined) {
    throw new Error('makeLoc requires type, name, and id parameters');
  }

  return {
    id,
    name_ar: name,
    name_en: name,
    latitude: landmarkValues?.latitude ?? 0,
    longitude: landmarkValues?.longitude ?? 0,
    governorate_id: 0,
    loc_type: type,
  };
}

export const hasErrors = (form: any) =>
  Object.entries(form.formState.errors).length > 0;
export const hasValue = (value: any) => Boolean(value);

export const useGetSidebarMeta = (): RouteConfig => {
  const pathname = usePathname();

  const matchedRouteDummy: RouteConfig = {
    icon: 'activeOrders',
    path: '',
    subtitle: '',
    title: '',
    roles: [],
  };

  const matchedRoute = useMemo(() => {
    for (const key in routes) {
      const route = routes[key];
      if (pathname.endsWith(route.path) && pathname.startsWith(route.path)) {
        return route;
      }
    }
    return null;
  }, [pathname]);

  return matchedRoute || matchedRouteDummy;
};

export function filterMenuByRole(menu: MenuItem[]) {
  const { user } = useAuthStore.getState();
  return menu
    .filter(
      (item) =>
        !item.roles || item.roles.some((role) => user?.roles.includes(role))
    )
    .map((item) => ({
      ...item,
      children: item.children
        ? item.children.filter(
            (child) =>
              !child.roles ||
              child.roles.some((role) => user?.roles.includes(role))
          )
        : undefined,
    }))
    .filter(
      (item) => item.route || (item.children && item.children?.length > 0)
    );
}
