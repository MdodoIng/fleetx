'use client';
import { debounce } from 'lodash';
import { useLocale } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';

export const isMounted = typeof window !== 'undefined';

export const useDebounce = (callback: (...args: any) => any, delay: number) => {
  const debouncedCallback = useCallback(debounce(callback, delay), [
    callback,
    delay,
  ]);
  return debouncedCallback;
};

export function useRTL(): {
  state: boolean;
  setRtl: 'rtl' | 'ltr';
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
    state: direction,
    setRtl: direction ? 'rtl' : 'ltr',
  };
}
