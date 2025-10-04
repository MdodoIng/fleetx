'use client';
import { debounce } from 'lodash';
import { useLocale } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { unstable_ViewTransition } from 'react';

export const isMounted = typeof window !== 'undefined';

export const ViewTransition = unstable_ViewTransition;

export const useDebounce = (
  callback: (...args: any) => void,
  delay: number
) => {
  const callbackRef = useRef(callback);

  // Always keep the latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedFn = useRef(
    debounce((...args: any) => {
      callbackRef.current(...args);
    }, delay)
  );

  return debouncedFn.current;
};
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
