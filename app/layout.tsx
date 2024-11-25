"use client"
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { Quicksand, Outfit } from "next/font/google";
import { ThemeScript } from "./theme-script";
import "./globals.css"; // Global styles imported only once
import { SessionProvider } from "next-auth/react";

// Fonts
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ['300', '400', '500', '700'],
  variable: "--font-quicksand",
  display: 'swap',
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: "--font-outfit",
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${quicksand.variable} ${outfit.variable}`}>
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>
            <Toaster />
            <SessionProvider>{children}</SessionProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
