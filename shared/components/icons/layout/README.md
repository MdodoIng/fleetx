# Sidebar Icons

A collection of customizable TSX icon components converted from SVG files. These icons support dynamic color changes and are optimized for use in navigation menus and arrays.

## Features

- 🎨 **Dynamic Colors**: All icons accept a `color` prop for easy theming
- 📏 **Customizable Size**: Width and height props for flexible sizing
- 🔄 **TypeScript Support**: Full type safety with TypeScript interfaces
- 🚀 **Performance**: Optimized SVG-to-TSX conversion
- 🎯 **Easy Integration**: Simple import and usage patterns

## Available Icons

- `ActiveOrdersIcon` - Active orders with checkmark
- `NewOrderIcon` - Delivery truck icon
- `MyWalletIcon` - Wallet/payment icon
- `HistoryIcon` - Clock/time history icon
- `BulkInsightsIcon` - Analytics chart icon
- `IntegrationsIcon` - Integration/connection icon

## Installation

```bash
# Icons are already part of the shared components
# Import them directly from the sidebar icons directory
```

## Basic Usage

### Individual Icon Usage

```tsx
import {
  ActiveOrdersIcon,
  NewOrderIcon,
} from '@/shared/components/icons/sidebar';

function MyComponent() {
  return (
    <div>
      {/* Default usage */}
      <ActiveOrdersIcon />

      {/* Custom size and color */}
      <NewOrderIcon width={32} height={32} color="#3B82F6" />

      {/* With CSS classes */}
      <MyWalletIcon
        className="hover:scale-110 transition-transform"
        color="#10B981"
      />
    </div>
  );
}
```

### Array/Map Usage

```tsx
import { iconMap, SidebarIconType } from '@/shared/components/icons/sidebar';

interface NavItem {
  id: string;
  name: string;
  icon: SidebarIconType;
  isActive: boolean;
}

const navigationItems: NavItem[] = [
  { id: '1', name: 'New Order', icon: 'newOrder', isActive: false },
  { id: '2', name: 'Active Orders', icon: 'activeOrders', isActive: true },
  { id: '3', name: 'History', icon: 'history', isActive: false },
  { id: '4', name: 'My Wallet', icon: 'myWallet', isActive: false },
];

function NavigationMenu() {
  return (
    <nav>
      {navigationItems.map((item) => {
        const IconComponent = iconMap[item.icon];
        return (
          <div key={item.id} className="nav-item">
            <IconComponent
              color={item.isActive ? '#004CF7' : '#6B7280'}
              width={24}
              height={24}
            />
            <span>{item.name}</span>
          </div>
        );
      })}
    </nav>
  );
}
```

## Utility Functions

### Using Icon Utilities

```tsx
import {
  renderSidebarIcon,
  renderSidebarIconWithDefaults,
  getColorFromScheme,
  colorSchemes,
} from '@/shared/components/icons/sidebar';

function UtilityExample() {
  return (
    <div>
      {/* Render icon dynamically */}
      {renderSidebarIcon('newOrder', {
        color: '#10B981',
        width: 20,
        height: 20,
      })}

      {/* Render with default props */}
      {renderSidebarIconWithDefaults('activeOrders', {
        color: getColorFromScheme('success'),
      })}

      {/* Using color schemes */}
      <NewOrderIcon color={colorSchemes.active} />
      <HistoryIcon color={colorSchemes.warning} />
    </div>
  );
}
```

### Dynamic Icon Rendering

```tsx
import {
  getIconComponent,
  isValidIconType,
} from '@/shared/components/icons/sidebar';

function DynamicIconRenderer({ iconType, ...props }) {
  // Validate icon type
  if (!isValidIconType(iconType)) {
    return <div>Invalid icon type</div>;
  }

  // Get and render component
  const IconComponent = getIconComponent(iconType);
  return IconComponent ? <IconComponent {...props} /> : null;
}

// Usage
<DynamicIconRenderer iconType="myWallet" color="#8B5CF6" />;
```

## Advanced Examples

### Sidebar Navigation Component

```tsx
import React, { useState } from 'react';
import {
  iconMap,
  SidebarIconType,
  colorSchemes,
} from '@/shared/components/icons/sidebar';

interface SidebarItem {
  id: string;
  label: string;
  icon: SidebarIconType;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  { id: 'new-order', label: 'New Order', icon: 'newOrder' },
  {
    id: 'active-orders',
    label: 'Active Orders',
    icon: 'activeOrders',
    badge: 5,
  },
  { id: 'history', label: 'History', icon: 'history' },
  { id: 'wallet', label: 'My Wallet', icon: 'myWallet' },
  { id: 'insights', label: 'Bulk Insights', icon: 'bulkInsights' },
  { id: 'integrations', label: 'Integrations', icon: 'integrations' },
];

function Sidebar() {
  const [activeItem, setActiveItem] = useState('active-orders');

  return (
    <aside className="w-64 bg-white shadow-lg">
      <nav className="p-4">
        {sidebarItems.map((item) => {
          const IconComponent = iconMap[item.icon];
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-2
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <IconComponent
                width={20}
                height={20}
                color={isActive ? colorSchemes.active : colorSchemes.default}
                className="flex-shrink-0"
              />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
```

### Theme-based Icon Colors

```tsx
import {
  colorSchemes,
  getColorFromScheme,
} from '@/shared/components/icons/sidebar';

// Define your theme
const theme = {
  light: {
    default: colorSchemes.default,
    active: colorSchemes.active,
    hover: colorSchemes.hover,
  },
  dark: {
    default: '#9CA3AF',
    active: '#60A5FA',
    hover: '#F3F4F6',
  },
};

function ThemedIcon({ iconType, state = 'default', isDark = false }) {
  const IconComponent = iconMap[iconType];
  const colors = isDark ? theme.dark : theme.light;

  return <IconComponent color={colors[state]} width={24} height={24} />;
}
```

## Props Interface

```tsx
interface SidebarIconProps {
  width?: number; // Default varies by icon (18 or 24)
  height?: number; // Default varies by icon (18 or 24)
  color?: string; // Default varies by icon
  className?: string; // Additional CSS classes
}
```

## Color Schemes

Available color schemes via `colorSchemes`:

- `default` - `#6B7280` (Gray)
- `active` - `#004CF7` (Blue)
- `hover` - `#374151` (Dark Gray)
- `success` - `#10B981` (Green)
- `warning` - `#F59E0B` (Yellow)
- `danger` - `#EF4444` (Red)
- `purple` - `#8B5CF6` (Purple)
- `pink` - `#EC4899` (Pink)

## TypeScript Support

All components and utilities are fully typed:

```tsx
import type {
  SidebarIconType,
  SidebarIconProps,
} from '@/shared/components/icons/sidebar';

// Type-safe icon selection
const iconType: SidebarIconType = 'newOrder'; // ✅ Valid
const invalidIcon: SidebarIconType = 'invalid'; // ❌ TypeScript error

// Props are fully typed
const iconProps: SidebarIconProps = {
  width: 24,
  height: 24,
  color: '#3B82F6',
  className: 'my-icon',
};
```

## Best Practices

1. **Consistent Sizing**: Use consistent icon sizes throughout your application
2. **Color Themes**: Use the provided color schemes for consistency
3. **Performance**: Import only the icons you need to reduce bundle size
4. **Accessibility**: Add appropriate `aria-label` attributes when needed
5. **Responsive Design**: Consider different icon sizes for mobile vs desktop

## Migration from SVG

If you need to add new icons:

1. Place SVG files in `assets/icons/sidebar/`
2. Convert to TSX components following the existing pattern
3. Add to `iconMap` in `iconUtils.ts`
4. Export from `index.ts`
5. Update types as needed

## Example Component

See `SidebarIconsExample.tsx` for a complete working example with all features demonstrated.
