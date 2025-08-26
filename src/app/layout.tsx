import type { Metadata } from 'next'
import { Inter, Crimson_Text } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { TypographyProvider, TypographyController } from '@/components/ui/TypographyController'
import './globals.css'

// Inter Variable for sans-serif (Apple-inspired)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

// Crimson Text for serif (premium reading experience)
const crimsonText = Crimson_Text({
  subsets: ['latin'],
  variable: '--font-charter',
  display: 'swap',
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Administrativa(mente) | Blog Premium de Gestão e Liderança',
    template: '%s | Administrativa(mente)',
  },
  description: 'Blog premium sobre gestão administrativa, liderança e estratégia corporativa. Insights exclusivos para executivos e gestores de alto nível.',
  keywords: [
    'gestão',
    'liderança',
    'estratégia',
    'administração',
    'management',
    'executivos',
    'gestores',
    'corporativo',
  ],
  authors: [{ name: 'Administrativa(mente)' }],
  creator: 'Administrativa(mente)',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://administrativamente.vercel.app',
    siteName: 'Administrativa(mente)',
    title: 'Administrativa(mente) | Blog Premium de Gestão e Liderança',
    description: 'Blog premium sobre gestão administrativa, liderança e estratégia corporativa.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Administrativa(mente)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Administrativa(mente) | Blog Premium de Gestão e Liderança',
    description: 'Blog premium sobre gestão administrativa, liderança e estratégia corporativa.',
    images: ['/twitter-image.png'],
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
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='pt-BR' className={`${inter.variable} ${crimsonText.variable}`} suppressHydrationWarning>
      <body className='min-h-screen bg-background font-sans antialiased'>
        <ThemeProvider 
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TypographyProvider>
            <div className='relative flex min-h-screen flex-col'>
              <Header />
              <main className='flex-1'>{children}</main>
              <Footer />
            </div>
            
            {/* Typography Controller - Premium Reading Experience */}
            <TypographyController />
          </TypographyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}