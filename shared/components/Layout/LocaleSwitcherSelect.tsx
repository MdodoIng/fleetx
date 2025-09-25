'use client';

import { Check, Globe, Languages } from 'lucide-react';
import { useState, useTransition } from 'react';
import { setUserLocale } from '@/shared/services/locale';
import { Locale } from '@/locales/config';

import { cn } from '@/shared/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import { getDirection } from '@/shared/lib/helpers/getDirection';
import { useSharedStore } from '@/store';

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
  variant?: 'normal' | 'dashboard';
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
  variant,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const { showLanguage } = useSharedStore();
  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div hidden={!showLanguage} className="relative">
      <Select
        defaultValue={defaultValue}
        onOpenChange={setIsOpen}
        onValueChange={onChange}
      >
        <SelectTrigger
          aria-label={label}
          size="sm"
          className={cn(
            "flex w-full items-center justify-between rounded-md  !border-none bg-black/25 px-4 py-4 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0 [&_svg:not([class*='text-'])]:hidden ",
            isPending &&
              'pointer-events-none opacity-60 starting:opacity-0 starting:translate-y-10 ',
            'hover:bg-black/50',
            variant === 'dashboard' &&
              '!h-full lg:bg-off-white bg-transparent text-dark-grey hover:bg-dark-grey/20 ',
            isOpen && 'lg:!bg-primary-blue lg:!text-off-white !bg-off-white/10'
          )}
        >
          <SelectValue>
            <Globe
              className={cn(
                'h-5 w-5 text-white ',
                variant === 'dashboard' && 'lg:text-dark-grey',
                isOpen && '!text-off-white'
              )}
            />
            <p className="capitalize font-english max-lg:hidden">
              {items.find((item) => item.value !== defaultValue)?.value || ''}
            </p>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-t-none">
          <SelectGroup>
            {items.map((item) => {
              const { dirState } = getDirection(item.value);
              return (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className={cn(
                    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    item.value === defaultValue && 'font-medium',
                    dirState ? 'font-arabic' : 'font-english',
                    variant === 'dashboard' && 'py-3'
                  )}
                >
                  <span className="flex items-center">
                    <span>{item.label}</span>
                  </span>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
