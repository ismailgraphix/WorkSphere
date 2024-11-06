'use client'

import { useEffect, useState } from "react"
import DashboardHeader from "@/components/header"
import AdminSidebar from "./admin/_components/sidebar"
import HrSidebar from "./hr/_components/sidebar"
import Sidebar from "./employee/_components/sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserRole = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        setUserRole(user.role)
      }
      setLoading(false)
    }

    // Ensure this runs only on the client side
    if (typeof window !== 'undefined') {
      getUserRole()
    }
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

  if (!userRole) {
    // Handle the case when no user role is found
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No user role found. Please log in again.</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <div>{renderSidebar()}</div>
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}