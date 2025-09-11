'use client';
import { APP_SIDEBAR_MENU } from '@/shared/constants/sidebar';
import { cn } from '@/shared/lib/utils';
import { UserRole } from '@/shared/types/user';
import { useAuthStore, useSharedStore } from '@/store';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import logo from '@/assets/images/logo white.webp';
import logoCollapsed from '@/assets/images/logo white Collapsed.webp';

import collapseIcon from '@/assets/icons/window collapse.svg';

import Link from 'next/link';
import { useState } from 'react';
import { iconMap } from '../../icons/layout';
import { filterMenuByRole } from '@/shared/lib/helpers';

const SideBar = ({
  header,
}: {
  header?: {
    title: string;
  };
}) => {
  const { isCollapsed, setValue } = useSharedStore();
  const { user } = useAuthStore();
  const t = useTranslations();

  const filteredMenu = filterMenuByRole(APP_SIDEBAR_MENU);

  return (
    <aside className="bg-primary-blue text-white flex flex-col gap-7 shrink-0 min-h-[-webkit-fill-available] h-full overflow-y-auto  px-4 pt-10 pb-10 transition-all duration-300">
      <div
        onClick={() => setValue('isCollapsed', !isCollapsed)}
        className="flex justify-between items-center gap-6 w-full"
      >
        <Image
          src={!isCollapsed ? logo : logoCollapsed}
          alt=""
          width={200}
          height={40}
          className={cn(
            ' w-auto object-contain ',
            !isCollapsed ? 'h-9' : 'h-6'
          )}
        />
        <button
          hidden={isCollapsed}
          className="cursor-pointer h-3 flex items-center justify-center shrink-0"
        >
          <Image
            src={collapseIcon}
            alt=""
            className="h-full w-auto object-contain "
          />
        </button>
      </div>
      <div className="gap-6 grid">
        {filteredMenu.map((item, index) => {
          const IconComponentMain = item.icon ? iconMap[item.icon!] : 'slot';
          return (
            <div key={index} className="flex flex-col group gap-2">
              <Link
                href={item?.route || '#'}
                className={cn(
                  'flex items-center gap-2 rounded-[6px]  bg-transparent pointer-events-none',
                  header?.title === item.labelKey &&
                    'bg-white text-primary-blue hover:bg-off-white',
                  item.route &&
                    'hover:bg-dark-grey/40 px-3 py-2 pointer-events-auto'
                )}
              >
                <IconComponentMain />
                <span hidden={isCollapsed}>{t(item.labelKey)}</span>
              </Link>
              {item.children && (
                <div className="flex flex-col gap-2 ">
                  {item.children.map((child, childIndex) => {
                    const IconComponentSub = child.icon
                      ? iconMap[child.icon!]
                      : 'slot';
                    return (
                      <Link
                        key={childIndex}
                        href={child?.route || '#'}
                        prefetch={true}
                        className={cn(
                          'flex items-center gap-2 px-3 rounded-[6px] py-2 bg-transparent hover:bg-dark-grey/40',
                          header?.title === child.labelKey &&
                            'bg-white text-primary-blue hover:bg-off-white',
                          isCollapsed && 'justify-center px-2'
                        )}
                      >
                        <IconComponentSub
                          className={
                            header?.title === child.labelKey
                              ? 'text-primary-blue'
                              : 'text-white'
                          }
                        />
                        <span hidden={isCollapsed}>{t(child.labelKey)}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
              <span
                className={cn(
                  'mx-auto h-[1px] bg-off-white/40 mt-2  group-last:hidden',
                  !isCollapsed ? 'w-[90%]' : 'w-[50%]'
                )}
              />
            </div>
          );
        })}
      </div>
    </aside>
  );
};
export default SideBar;
