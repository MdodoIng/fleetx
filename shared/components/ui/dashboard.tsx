'use client';

import { cn } from '@/shared/lib/utils';
import main_padding from '@/styles/padding';
import { useGetSidebarMeta } from '@/shared/lib/helpers';
import { iconMap } from '../icons/layout';
import { useTranslations } from 'next-intl';
import { ArrowUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './button';
import { AnimatePresence, motion } from 'framer-motion';

function Dashboard({ className, ...props }: React.ComponentProps<'div'>) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerId = 'dashboard-scroll-container';
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return; // Exit if the ref isn't attached yet

    const handleScroll = () => {
      // Read the scroll position directly from the container element
      const scrollY = element.scrollTop;

      // Check if scroll is beyond 400px
      setShowScrollTop(scrollY > 400);
    };

    // Add listener to the specific div element, not the window
    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => element.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    // Scroll the specific element to the top smoothly
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        ref={scrollRef}
        id={scrollContainerId}
        data-slot="dashboard"
        className={cn(
          'bg-off-white text-black flex flex-col gap-6 py-6 relative overflow-y-auto',
          main_padding.dashboard.x,
          className
        )}
        {...props}
      >
        {props.children}
        {showScrollTop && (
          <Button
            variant={'outline'}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 !p-2 size-auto aspect-square rounded-full shadow transition-all bg-white/50 starting:opacity-0 starting:bottom-0 duration-500 hover:text-dark-grey hover:border-dark-grey"
            aria-label="Scroll to top"
          >
            <ArrowUp className="size-5" />
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function DashboardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dashboard-header"
      className={cn(
        'flex items-start justify-between max-2xl:flex-wrap sm:gap-x-10 gap-x-6 gap-y-4 w-full  ',
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
