import { Montserrat } from 'next/font/google';

import localFont from 'next/font/local';

const rHZak = localFont({
  src: [
    {
      path: '../../assets/fonts/RHZak.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/RHZak.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-rhzak',
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export { montserrat, rHZak };
