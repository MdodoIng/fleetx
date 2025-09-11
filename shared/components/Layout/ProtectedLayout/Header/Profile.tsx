'use client';

import {
  iconMap,
  NewOrderIcon,
  PasswordIcon,
} from '@/shared/components/icons/layout';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { APP_PROFILE_MENU } from '@/shared/constants/profile';
import { filterMenuByRole } from '@/shared/lib/helpers';
import { useDir } from '@/shared/lib/hooks';
import { cn } from '@/shared/lib/utils';
import { getUserLocale } from '@/shared/services/locale';
import { UserRole } from '@/shared/types/user';
import { useAuthStore, useVenderStore } from '@/store';
import { User, Lock, FileText, LogOut, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { selectedBranch, branchDetails, branchId, selectedVendor } =
    useVenderStore();

  const filteredMenu = filterMenuByRole(APP_PROFILE_MENU);
  const t = useTranslations();
  const { dirState } = useDir();

  console.log(selectedVendor);

  const branch = selectedVendor?.branches.find((item) => item.id === branchId);
  const branchName = branch ? (dirState ? branch.name : branch.name_ar) : '';

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
          isOpen && 'bg-primary-blue text-off-white'
        )}
      >
        <Button
          variant="ghost"
          className={cn(
            'flex items-center gap-3 px-4  bg-off-white hover:bg-dark-grey/20 rounded-md text-sm font-medium text-dark-grey',
            isOpen && 'bg-primary-blue text-off-white'
          )}
        >
          <User className="size-5 " />
          <span className="text-left flex flex-col gap-3 ">
            <div
              className={cn(
                'font-medium text-[#262626] leading-1',
                isOpen && 'text-off-white'
              )}
            >
              {user?.user.first_name}
            </div>
            <div
              className={cn(
                'text-xs text-[#8E8D8F] leading-1',
                isOpen && 'text-off-white/40'
              )}
            >
              {branchName}
            </div>
          </span>
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white rounded-t-none ">
        {filteredMenu.map((item, index) => {
          const IconComponentMain = item.icon ? iconMap[item.icon] : 'slot';

          return (
            <DropdownMenuItem
              asChild
              key={index}
              className="flex items-center gap-2 px-2 py-3 cursor-pointer"
            >
              <Link href={item.route!}>
                <IconComponentMain className='text-dark-grey' />
                <span>{t(item.labelKey as any)}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuItem
          onClick={() => logout()}
          className="flex items-center gap-2 px-2 py-3 cursor-pointer"
        >
          <PasswordIcon className='text-dark-grey' />
          <span>{t('layout.profile.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
