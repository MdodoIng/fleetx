import { SidebarIconType } from '@/shared/components/icons/layout';
import { UserRole } from '../user';

export interface MenuItem {
  labelKey: any;
  route?: string;
  roles?: UserRole[];
  icon?: SidebarIconType;
  children?: MenuItem[];
}

interface RouteConfig {
  path: string;
  title: any;
  subtitle: any;
  icon: SidebarIconType;
  roles?: UserRole[];
}

export type Routes = {
  [key: string]: RouteConfig;
};
