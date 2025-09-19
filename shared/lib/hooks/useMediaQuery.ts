'use client';

import { useEffect, useState } from 'react';

const breakpointMap = {
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 1024px)',
  xl: '(max-width: 1280px)',
  '2xl': '(max-width: 1536px)',
};

export default function useMediaQuery(
  queryOrBreakpoint: keyof typeof breakpointMap | string
): boolean {
  const query =
    breakpointMap[queryOrBreakpoint as keyof typeof breakpointMap] ??
    queryOrBreakpoint;

  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    const updateMatch = () => setMatches(mediaQueryList.matches);

    updateMatch();
    mediaQueryList.addEventListener('change', updateMatch);

    return () => mediaQueryList.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
}
