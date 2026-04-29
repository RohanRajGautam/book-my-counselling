import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Book My Counselling',
    template: '%s | Book My Counselling',
  },
  description:
    'Professional counselling services made easy. Book your session with qualified counsellors and take the first step towards better mental health.',
  keywords: [
    'counselling',
    'therapy',
    'mental health',
    'book counsellor',
    'online therapy',
    'mental wellness',
  ],
  authors: [{ name: 'Book My Counselling' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bookmycounselling.com',
    siteName: 'Book My Counselling',
    title: 'Book My Counselling - Professional Counselling Services',
    description:
      'Professional counselling services made easy. Book your session with qualified counsellors.',
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
    description: 'Professional counselling services made easy.',
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
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
