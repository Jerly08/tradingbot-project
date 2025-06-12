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
        {/* CSP is now managed through middleware */}
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
