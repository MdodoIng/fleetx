import { SidebarIconType } from '@/shared/components/icons/layout';
import { UserRole } from '../user';

export interface MenuItem {
  labelKey: string;
  route?: string;
  roles?: UserRole[];
  icon?: SidebarIconType;
  children?: MenuItem[];
}

interface RouteConfig {
  path: string;
  title: string;
  subtitle: string;
  icon: SidebarIconType;
  roles?: UserRole[];
}

export type Routes = {
  [key: string]: RouteConfig;
};
