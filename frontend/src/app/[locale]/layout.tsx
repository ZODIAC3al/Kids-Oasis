import { ReactNode } from 'react';
import { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { RootProviders } from '@/providers/root-providers';
import { BackgroundAnimation } from '@/components/ui/background-animation';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import PWAInstallBanner from '@/components/PWAInstallBanner';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Kids Oasis — Education Marketplace',
    template: '%s | Kids Oasis',
  },
  description: 'Find and enroll your child in the best nurseries, preschools, STEM academies, and activity centers in Egypt.',
  applicationName: 'Kids Oasis',
  keywords: ['nursery', 'preschool', 'academy', 'kids education', 'Egypt', 'Alexandria', 'Cairo', 'STEM', 'Montessori'],
  authors: [{ name: 'Kids Oasis Team' }],
  creator: 'Kids Oasis',
  publisher: 'Kids Oasis',
  formatDetection: { telephone: false },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kids Oasis',
    startupImage: [
      { url: '/icons/apple-touch-icon.png', media: '(device-width: 390px)' },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'Kids Oasis',
    title: 'Kids Oasis — Education Marketplace',
    description: 'Find the best nurseries, preschools, and academies in Egypt.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kids Oasis — Education Marketplace',
    description: 'Find the best nurseries, preschools, and academies in Egypt.',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      { rel: 'mask-icon', url: '/icons/icon-maskable-192.png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4F46E5' },
    { media: '(prefers-color-scheme: dark)', color: '#6366F1' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        {/* PWA / Mobile Chrome */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kids Oasis" />
        {/* Windows Tiles */}
        <meta name="msapplication-TileColor" content="#4F46E5" />
        <meta name="msapplication-TileImage" content="/icons/icon-144.png" />
        <meta name="msapplication-config" content="none" />
        {/* Prevent phone number auto-link */}
        <meta name="format-detection" content="telephone=no" />
        {/* Splash screens for iOS (key sizes) */}
        <link rel="apple-touch-startup-image" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="antialiased min-h-screen relative">
        <NextIntlClientProvider messages={messages}>
          <RootProviders>
            <BackgroundAnimation />
            {children}
            {/* Register service worker client-side */}
            <ServiceWorkerRegistrar />
            {/* PWA install prompt banner */}
            <PWAInstallBanner />
          </RootProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

