import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})



export const metadata: Metadata = {
  title: 'Splash Media | Utah Marketing Agency',
  description:
    'A Utah marketing agency built for brands that refuse to blend in. Strategy, design, and campaigns that move the needle.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/luy1uie.css" />

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: '#061a36' }}
      >
        <Navbar />
        {children}

         <Footer />
      </body>
    </html>

    
  )
}