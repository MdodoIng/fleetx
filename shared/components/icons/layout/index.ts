// Icon components
export { ActiveOrdersIcon } from './ActiveOrdersIcon';
export { NewOrderIcon } from './NewOrderIcon';
export { MyWalletIcon } from './MyWalletIcon';
export { HistoryIcon } from './HistoryIcon';
export { BulkInsightsIcon } from './BulkInsightsIcon';
export { IntegrationsIcon } from './IntegrationsIcon';
export { PasswordIcon } from './PasswordIcon';
export { BillIcon } from './BillIcon';
export { PeopleListIcon } from './PeopleListIcon';

// Utilities
export {
  iconMap,
  getIconComponent,
  defaultIconConfigs,
  getDefaultIconProps,
  colorSchemes,
  getColorFromScheme,
  isValidIconType,
  getAvailableIconTypes,
} from './iconUtils';

// Types
export type SidebarIconType =
  | 'activeOrders'
  | 'newOrder'
  | 'myWallet'
  | 'history'
  | 'bulkInsights'
  | 'integrations'
  | 'password'
  | 'bill'
  | 'peopleList'
  | 'userPlus'
  | 'users';

export interface SidebarIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
