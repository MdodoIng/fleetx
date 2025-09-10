'use client';

import * as React from 'react';
import { Check, Globe, Languages } from 'lucide-react';
import { useTransition } from 'react';
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


type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className="relative">
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger
          aria-label={label}
          size="sm"
          className={cn(
            "flex w-full items-center justify-between rounded-md  !border-none bg-black/25 px-4 py-4 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 ring-offset-background focus:ring-0 focus:ring-ring focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 [&_svg:not([class*='text-'])]:hidden ",
            isPending &&
            'pointer-events-none opacity-60 starting:opacity-0 starting:translate-y-10 ',
            'hover:bg-black/50'
          )}
        >
          <SelectValue>
            <Globe className="h-5 w-5 text-white" />
            <p className="capitalize">
              {items.find((item) => item.value !== defaultValue)?.value || ''}
            </p>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
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
                    dirState ? 'font-arabic' : 'font-english'
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
