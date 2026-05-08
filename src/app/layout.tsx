import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google'

import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

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
    default: 'Book My Counselling | Find Your Mentor',
    template: '%s | Book My Counselling',
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
  authors: [{ name: 'Book My Counselling' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bookmycounselling.com',
    siteName: 'Book My Counselling',
    title: 'Book My Counselling - Your Career Journey, Curated',
    description: 'Connect with world-class mentors from industry giants and top universities.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Book My Counselling',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book My Counselling',
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
      <body className="min-h-screen bg-[#f8f9ff] font-[family-name:var(--font-body)] text-[#121c2a] antialiased">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
