// Icon components
export { ActiveOrdersIcon } from './ActiveOrdersIcon';
export { NewOrderIcon } from './NewOrderIcon';
export { HistoryIcon } from './HistoryIcon';
export { BulkInsightsIcon } from './BulkInsightsIcon';
export { IntegrationsIcon } from './IntegrationsIcon';
export { PasswordIcon } from './PasswordIcon';
export { BillIcon } from './BillIcon';
export { PeopleListIcon } from './PeopleListIcon';
export { BalanceReportIcon } from './BalanceReportIcon';
export { OverviewIcon } from './OverviewIcon';

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
  | 'users'
  | 'balanceReport'
  | 'overview'
  | 'chartBar'
  | 'star'
  | 'chartNoAxesGantt'
  | 'settings'
  | 'walletCards'
  | 'chartPie'
  | 'layoutDashboard'
  | 'chartSpline'
  | 'fileChartColumn'
  | 'chartScatter'
  | 'chartLine'
  | 'chartCandlestick'
  | 'funnel'
  | 'handCoins';

export interface SidebarIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
