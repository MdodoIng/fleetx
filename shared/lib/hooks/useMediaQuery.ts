'use client';

import { useEffect, useState } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpointMap: Record<Breakpoint, string> = {
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 1024px)',
  xl: '(max-width: 1280px)',
  '2xl': '(max-width: 1536px)',
};

export default function useMediaQuery(queryOrBreakpoint: Breakpoint | string ): boolean {
  const query =
    breakpointMap[queryOrBreakpoint as Breakpoint] ?? queryOrBreakpoint;

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
