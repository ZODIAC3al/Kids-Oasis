import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { RootProviders } from '@/providers/root-providers';
import { BackgroundAnimation } from '@/components/ui/background-animation';
import '@/app/globals.css';

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
      <body className="antialiased min-h-screen relative">
        <NextIntlClientProvider messages={messages}>
          <RootProviders>
            <BackgroundAnimation />
            {children}
          </RootProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
