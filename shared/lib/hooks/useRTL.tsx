import { useLocale } from "next-intl";
import { useMemo, useState } from "react";

export default function useRTL() {
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
