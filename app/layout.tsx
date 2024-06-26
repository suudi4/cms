import { Toaster } from "@/components/ui/sonner"
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from './provider'
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "next-themes"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'tsafi',
  description: 'An opensource blog site and CMS built using Nextjs, Supabase & TipTap',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
        <script defer src={process.env.TINY_SRC} data-host={process.env.TINY_BIRD_DATA_HOST} data-token={process.env.TINY_BIRD_DATA_TOKEN}></script>
        </head>
        <body className={inter.className}>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >

              {children}
            </ThemeProvider>
            <Toaster />
          </Provider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}