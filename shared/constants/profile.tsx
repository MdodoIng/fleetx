import { SidebarIconType } from '../components/icons/layout';
import { MenuItem } from '../types/constants';
import { UserRole } from '../types/user';

export const APP_PROFILE_MENU: MenuItem[] = [
  {
    labelKey: 'layout.profile.changePassword',
    route: '/dashboard',
    icon: 'password',
  },
  {
    labelKey: 'layout.profile.editBilling',
    route: '/billing/edit-profile',
    icon: 'bill',
  },
] as const;
