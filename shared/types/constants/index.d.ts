import { SidebarIconType } from "@/shared/components/icons/layout";

export interface MenuItem {
  labelKey: string;
  route?: string;
  roles?: UserRole[];
  icon?: SidebarIconType;
  children?: MenuItem[];
}
