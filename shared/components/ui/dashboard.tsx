import * as React from 'react';

import { cn } from '@/shared/lib/utils';
import main_padding from '@/styles/padding';
import { useGetSidebarMeta } from '@/shared/lib/helpers';
import { iconMap } from '../icons/layout';
import { useTranslations } from 'next-intl';

function Dashboard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dashboard"
      className={cn(
        'bg-off-white text-black flex flex-col gap-6 py-6',
        main_padding.dashboard.x,
        className
      )}
      {...props}
    />
  );
}

function DashboardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dashboard-header"
      className={cn(
        'flex items-start justify-between max-xl:flex-wrap sm:gap-x-10 gap-x-6 gap-y-4 w-full  ',
        className
      )}
      {...props}
    />
  );
}

function DashboardHeaderRight({
  className,
  title: customTitle,
  subtitle: customSubtitle,

  ...props
}: React.ComponentProps<'div'> & { subtitle?: string }) {
  const { title, icon, subtitle } = useGetSidebarMeta();
  const IconComponent = iconMap[icon] ?? 'slot';
  const t = useTranslations();
  return (
    <div className={cn('flex gap-4 items-center', className)}>
      <div className={cn('flex gap-4 items-start')} {...props}>
        <IconComponent className="bg-white border border-[#2828281A] aspect-square h-10 w-auto p-2 text-primary-blue rounded-[8px] shrink-0" />
        <div className="flex flex-col">
          <h3 className="text-xl font-medium text-dark-grey">
            {customTitle ?? t(title)}
          </h3>
          <p className="text-dark-grey/50 text-sm">
            {customSubtitle ?? t(subtitle)}
          </p>
        </div>
      </div>
      {props.children}
    </div>
  );
}

function DashboardContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dashboard-content"
      className={cn(
        'flex gap-6 items-start justify-center',
        main_padding.dashboard.y,
        className
      )}
      {...props}
    />
  );
}

function DashboardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dashboard-footer"
      className={cn(
        'flex items-center md:sticky bottom-0 left-0 w-full',
        main_padding.dashboard.y,
        className
      )}
      {...props}
    />
  );
}

export {
  Dashboard,
  DashboardHeader,
  DashboardFooter,
  DashboardContent,
  DashboardHeaderRight,
};
