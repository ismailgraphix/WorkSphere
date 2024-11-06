import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { Quicksand, Outfit } from 'next/font/google'
import { ThemeScript } from './theme-script'
import './globals.css';
import { SessionProvider } from "next-auth/react"

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${quicksand.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
      <ThemeScript />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            <Toaster />
            <SessionProvider>
              {children}
            </SessionProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}