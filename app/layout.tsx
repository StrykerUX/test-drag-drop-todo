import type { Metadata } from 'next'
import { Caveat } from 'next/font/google'
import './globals.css'

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
})

export const metadata: Metadata = {
  title: 'Post-it TODO Board',
  description: 'A draggable post-it note board',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${caveat.variable} antialiased`}>{children}</body>
    </html>
  )
}
