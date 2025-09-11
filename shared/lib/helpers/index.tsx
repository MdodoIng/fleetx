import { TypePickUpSchema } from '@/features/orders/validations/order';
import { useOrderStore } from '@/store/useOrderStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { APP_SIDEBAR_MENU } from '@/shared/constants/sidebar';
import { UserRole } from '@/shared/types/user';
import { MenuItem } from '@/shared/types/constants';
import { useAuthStore } from '@/store';

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

export const useGetSidebarMeta = (pathname: string) => {
  for (const item of APP_SIDEBAR_MENU) {
    if (item.children) {
      const child = item.children.find((c) => pathname.startsWith(c.route));
      if (child) {
        return {
          title: child.labelKey,
          roles: child.roles ?? item.roles ?? [],
        };
      }
    }

    if (pathname.startsWith(item.route)) {
      return {
        title: item.labelKey,
        roles: item.roles ?? [],
      };
    }
  }

  return { title: '', roles: [] };
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
    }));
}
