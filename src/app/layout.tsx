import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trading Bot Dashboard',
  description: 'Configure and monitor your trading bot with DMI/ADX strategy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://*.binancefuture.com https://*.mongodb.net https://vercel.live; worker-src 'self' blob:;"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
