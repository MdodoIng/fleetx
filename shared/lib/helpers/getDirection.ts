export function getDirection(locale: string = 'en') {
  const isRTL = locale.startsWith('ar');
  const direction = isRTL ? 'rtl' : 'ltr';

  return {
    dirState: isRTL,
    setDir: direction,
    setDirStyle: { direction },
    setDirClassName: direction,
  };
}
