'use client'

import { useEffect, useState } from "react"
import { Quicksand, Outfit } from 'next/font/google'

import DashboardHeader from "@/components/header"
import AdminSidebar from "./admin/_components/sidebar"
import HrSidebar from "./hr/_components/sidebar"
import Sidebar from "./employee/_components/sidebar"
import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserRole(user.role)
    }
    setLoading(false)
  }, [])

  const renderSidebar = () => {
    switch (userRole) {
      case "ADMIN":
        return <AdminSidebar />
      case "HR":
        return <HrSidebar />
      case "EMPLOYEE":
        return <Sidebar />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <html lang="en" className={`${quicksand.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        <ToastProvider>
          <Toaster />
          <div className="flex h-screen">
            {renderSidebar() && <div>{renderSidebar()}</div>}
            <div className="flex-1 flex flex-col">
              <DashboardHeader />
              <main className="p-4">{children}</main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}