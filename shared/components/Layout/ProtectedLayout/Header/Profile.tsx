'use client';

import { iconMap, PasswordIcon } from '@/shared/components/icons/layout';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { APP_PROFILE_MENU } from '@/shared/constants/routes';
import { filterMenuByRole } from '@/shared/lib/helpers';
import { cn } from '@/shared/lib/utils';
import { useAuthStore, useVendorStore } from '@/store';
import { ChevronDown, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { branchName } = useVendorStore();

  const filteredMenu = filterMenuByRole(APP_PROFILE_MENU);
  const t = useTranslations();

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
          isOpen && 'lg:!bg-primary-blue lg:!text-off-white !bg-off-white/10'
        )}
      >
        <Button
          variant="ghost"
          className={cn(
            'flex items-center gap-3 lg:px-4  lg:bg-off-white hover:bg-dark-grey/20 rounded-md text-sm font-medium text-dark-grey'
          )}
        >
          <User className="size-5 max-lg:text-off-white " />
          <span className="text-left flex flex-col gap-3 max-lg:hidden ">
            <div
              className={cn(
                'font-medium text-[#262626] leading-1',
                isOpen && 'text-off-white'
              )}
            >
              {user?.user.first_name}
            </div>
            <div
              hidden={!branchName}
              className={cn(
                'text-xs text-[#8E8D8F] leading-1',
                isOpen && 'text-off-white/40'
              )}
            >
              {branchName}
            </div>
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 ml-auto max-lg:hidden duration-500',
              isOpen && 'rotate-180'
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white rounded-t-none">
        {filteredMenu.map((item, index) => {
          const IconComponentMain = item.icon ? iconMap[item.icon] : 'slot';

          return (
            <DropdownMenuItem
              asChild
              key={index}
              className="flex items-center gap-2 px-2 py-3 cursor-pointer rtl:justify-end"
            >
              <Link href={item.route!}>
                <IconComponentMain
                  width={20}
                  height={20}
                  className="text-dark-grey rtl:order-2"
                />
                <span>{t(item.labelKey as any)}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuItem
          onClick={() => logout()}
          className="flex items-center gap-2 px-2 py-3 cursor-pointer rtl:justify-end"
        >
          <PasswordIcon
            width={20}
            height={20}
            className="text-dark-grey rtl:order-2"
          />
          <span>{t('layout.profile.logout.title')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
