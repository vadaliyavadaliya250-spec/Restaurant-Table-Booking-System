import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'


export const metadata: Metadata = {
  title: 'The Aurelius — Digital Menu',
  description: 'Fine dining experience at The Aurelius Hotel',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#B8933A',
}

import { LanguageProvider } from '@/lib/useLanguage'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

type Props = {
  children: React.ReactNode
}


export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        <LanguageProvider>
          <div className="fixed top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}


