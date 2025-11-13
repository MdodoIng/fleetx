'use client';
import { useLocale } from 'next-intl';
import { unstable_ViewTransition, useMemo, useState } from 'react';

export const isMounted = typeof window !== 'undefined';

export const ViewTransition = unstable_ViewTransition;

export function useDir(): {
  dirState: boolean;
  setDir: 'rtl' | 'ltr';
} {
  const [direction, setDirection] = useState<boolean>(false);
  const locale = useLocale() ?? 'en';

  useMemo(() => {
    const determineDirection = () => {
      if (locale.startsWith('ar')) {
        setDirection(true);
      } else {
        setDirection(false);
      }
    };

    determineDirection();
  }, [locale]);

  return {
    dirState: direction,
    setDir: direction ? 'rtl' : 'ltr',
  };
}
