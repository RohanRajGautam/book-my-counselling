import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.css'
import { Providers } from './providers'
import Script from 'next/script'
const headline = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Book Your Counselling | Find Your Mentor',
    template: '%s | Book Your Counselling',
  },
  description:
    'Connect with world-class mentors from industry giants and top universities to navigate your professional growth with precision.',
  keywords: [
    'career mentorship',
    'professional mentors',
    'career guidance',
    'admissions counseling',
    'tech mentors',
    'career coaching',
  ],
  authors: [{ name: 'Book Your Counselling' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bookmycounselling.com',
    siteName: 'Book Your Counselling',
    title: 'Book Your Counselling - Your Career Journey, Curated',
    description: 'Connect with world-class mentors from industry giants and top universities.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Book Your Counselling',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Your Counselling',
    description: 'Your Career Journey, Curated.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://bookmycounselling.com'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${headline.variable} ${body.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "wrxgt2khmj");
    `}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CLZVN0BK1Q"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-CLZVN0BK1Q');
  `}
        </Script>
      </head>
      <body
        className="min-h-screen bg-[#f8f9ff] font-[family-name:var(--font-body)] text-[#121c2a] antialiased"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
