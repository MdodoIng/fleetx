import { getDirection } from '@/shared/lib/helpers/getDirection';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import './globals.css';

import LoadingPage from '@/shared/components/Layout/Loading';
import { Toaster } from '@/shared/components/ui/sonner';
import { montserrat, rHZak } from '@/shared/lib/font';

export const metadata: Metadata = {
  title: 'FleetX Partner Hub',
  description:
    "Send your orders quickly and easily. Join Kuwait’s most trusted delivery network. Pick up in 30 to 90 minutes. Track every order live. Trained Professional Drivers. Order & Shipment support 24/7. No setup fees - start today. Questions? We're here to help! Our local team speaks Arabic & English.",

  openGraph: {
    title: 'Fleetx Partner Hub',
    description:
      "Send your orders quickly and easily. Join Kuwait’s most trusted delivery network. Pick up in 30 to 90 minutes. Track every order live. Trained Professional Drivers. Order & Shipment support 24/7. No setup fees - start today. Questions? We're here to help! Our local team speaks Arabic & English.",
    images: [
      {
        url: '/images/og_image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FleetX Partner Hub',
    description:
      "Send your orders quickly and easily. Join Kuwait’s most trusted delivery network. Pick up in 30 to 90 minutes. Track every order live. Trained Professional Drivers. Order & Shipment support 24/7. No setup fees - start today. Questions? We're here to help! Our local team speaks Arabic & English.",
    images: ['/images/og_image.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const { setDir, dirState } = getDirection(locale);

  return (
    <html
      dir={setDir}
      lang={locale}
      suppressHydrationWarning
      className={`${montserrat.variable} ${rHZak.variable}`}
      style={dirState ? rHZak.style : montserrat.style}
    >
      <body>
        <Toaster position="top-right" richColors />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <LoadingPage />
      </body>
    </html>
  );
}
