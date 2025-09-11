import { ComponentType, JSX } from 'react';
import {
  ActiveOrdersIcon,
  NewOrderIcon,
  MyWalletIcon,
  HistoryIcon,
  BulkInsightsIcon,
  IntegrationsIcon,
  SidebarIconType,
  SidebarIconProps,
  PasswordIcon,
  BillIcon,
} from './index';

// Icon mapping for dynamic rendering
export const iconMap: Record<
  SidebarIconType,
  ComponentType<SidebarIconProps>
> = {
  activeOrders: ActiveOrdersIcon,
  newOrder: NewOrderIcon,
  myWallet: MyWalletIcon,
  history: HistoryIcon,
  bulkInsights: BulkInsightsIcon,
  integrations: IntegrationsIcon,
  password: PasswordIcon,
  bill: BillIcon,
};

// Get icon component by type
export const getIconComponent = (
  iconType: SidebarIconType
): ComponentType<SidebarIconProps> | null => {
  return iconMap[iconType] || null;
};

// // Render icon with props
// export const renderSidebarIcon = (
//   iconType: SidebarIconType,
//   props: SidebarIconProps = {}
// ): JSX.Element | null => {
//   const IconComponent = getIconComponent(iconType);
//   if (!IconComponent) return null;

//   if (!IconComponent) {
//     return null;
//   }
//   return <IconComponent {...props} />;
// };

// Default icon configurations
export const defaultIconConfigs: Record<
  SidebarIconType,
  Partial<SidebarIconProps>
> = {
  activeOrders: {
    width: 18,
    height: 18,
    color: 'currentColor',
  },
  newOrder: {
    width: 24,
    height: 24,
    color: '#004CF7',
  },
  myWallet: {
    width: 24,
    height: 24,
    color: '#F5F4F5',
  },
  history: {
    width: 18,
    height: 18,
    color: '#F5F4F5',
  },
  bulkInsights: {
    width: 24,
    height: 24,
    color: '#F5F4F5',
  },
  integrations: {
    width: 24,
    height: 24,
    color: '#F5F4F5',
  },
};

// Get default props for an icon
export const getDefaultIconProps = (
  iconType: SidebarIconType
): Partial<SidebarIconProps> => {
  return defaultIconConfigs[iconType] || {};
};

// Common color schemes
export const colorSchemes = {
  default: '#6B7280',
  active: '#004CF7',
  hover: '#374151',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
} as const;

// Helper function to get color from scheme
export const getColorFromScheme = (
  scheme: keyof typeof colorSchemes
): string => {
  return colorSchemes[scheme];
};

// Icon validation
export const isValidIconType = (
  iconType: string
): iconType is SidebarIconType => {
  return Object.keys(iconMap).includes(iconType as SidebarIconType);
};

// Get all available icon types
export const getAvailableIconTypes = (): SidebarIconType[] => {
  return Object.keys(iconMap) as SidebarIconType[];
};
