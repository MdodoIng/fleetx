'use client';
import { clsx, type ClassValue } from 'clsx';
import { useLocale } from 'next-intl';

import { useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export  function useRTL() {
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const locale = useLocale() ?? 'en';

  useMemo(() => {
    const determineDirection = () => {
      if (locale.startsWith('ar')) {
        setDirection('rtl');
      } else {
        setDirection('ltr');
      }
    };

    determineDirection();
  }, [locale]);

  return direction;
}
