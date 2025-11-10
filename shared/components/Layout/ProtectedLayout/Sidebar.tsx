'use client';
import logoCollapsed from '@/assets/images/logo white Collapsed.webp';
import logo from '@/assets/images/logo white.webp';
import { cn } from '@/shared/lib/utils';
import { useSharedStore } from '@/store';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import collapseIcon from '@/assets/icons/window collapse.svg';

import { APP_SIDEBAR_MENU } from '@/shared/constants/routes';
import { filterMenuByRole, useGetSidebarMeta } from '@/shared/lib/helpers';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import { iconMap } from '../../icons/layout';

const SideBar = () => {
  const { isCollapsed, setValue } = useSharedStore();

  const t = useTranslations();

  const filteredMenu = filterMenuByRole(APP_SIDEBAR_MENU);

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (
        !isCollapsed &&
        event.target &&
        !document.getElementById('sidebar')?.contains(event.target as Node)
      ) {
        setValue('isCollapsed', true);
      }
    },
    [isCollapsed, setValue]
  );

  useEffect(() => {
    if (window.innerWidth > 1024 && !isCollapsed) return;

    document.addEventListener('click', handleOutsideClick, true);

    return () => {
      document.removeEventListener('click', handleOutsideClick, true);
    };
  }, [handleOutsideClick, isCollapsed]);

  const { title } = useGetSidebarMeta();

  return (
    <aside
      className={cn(
        'bg-primary-blue text-white flex flex-col gap-7 shrink-0 min-h-[-webkit-fill-available] h-full overflow-y-auto  px-4 pt-10 pb-10 transition-all duration-300 max-lg:fixed z-50 top-0 left-0 max-lg:rounded-r-2xl will-change-auto',
        isCollapsed && 'max-lg:-left-full '
      )}
    >
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
                hidden={isCollapsed && !item?.route}
                href={item?.route || '#'}
                title={t(item.labelKey)}
                className={cn(
                  'flex items-center gap-2 rounded-[6px]  bg-transparent pointer-events-none',
                  item.labelKey === title &&
                    'bg-white text-primary-blue hover:bg-off-white',
                  item.route &&
                    'hover:bg-dark-grey/40 px-3 py-2 pointer-events-auto'
                )}
              >
                <IconComponentMain width={20} height={20} />
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
                        title={t(child.labelKey)}
                        className={cn(
                          'flex items-center gap-2 px-3 rounded-[6px] py-2 bg-transparent hover:bg-dark-grey/40',
                          title === child.labelKey &&
                            'bg-white text-primary-blue hover:bg-off-white',
                          isCollapsed && 'justify-center px-2'
                        )}
                      >
                        <IconComponentSub
                          className={
                            title === child.labelKey
                              ? '!text-primary-blue'
                              : '!text-white'
                          }
                          width={20}
                          height={20}
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
