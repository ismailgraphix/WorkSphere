'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Clock,
  FileText,
  User,
  Settings,
  Wallet,
  Building2,
  CalendarDays,
} from 'lucide-react'

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Sidebar() {
  const pathname = usePathname()

  const mainMenuItems = [
    { href: '/employee', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/employee/leave', icon: Calendar, label: 'Leave Management' },
    { href: '/employee/holidays', icon: CalendarDays, label: 'Holidays' },
    { href: '/employee/attendance', icon: Clock, label: 'Attendance' },
    { href: '/employee/payslips', icon: Wallet, label: 'Payslips' },
    { href: '/employee/documents', icon: FileText, label: 'Documents' },
    { href: '/employee/department', icon: Building2, label: 'My Department' },
  ]

  const accountItems = [
    { href: '/employee/profile', icon: User, label: 'My Profile' },
    { href: '/employee/settings', icon: Settings, label: 'Settings' },
  ]

  const NavItem = ({ href, icon: Icon, label }) => {
    const isActive = pathname === href
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-all hover:text-gray-100",
                isActive ? "bg-gray-700 text-gray-100" : "hover:bg-gray-700"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <aside className="flex h-screen w-64 flex-col bg-gray-800 text-white">
      <div className="flex items-center gap-2 px-4 py-6">
        <Image src="/employee.png" alt="Company Logo" width={32} height={32} />
        <h2 className="text-xl font-semibold">Employee Portal</h2>
      </div>
      
      <nav className="flex flex-col flex-1 px-2 py-4">
        <div className="flex-1">
          <h3 className="mb-2 px-4 text-xs uppercase text-gray-400">Main Menu</h3>
          {mainMenuItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-700">
          <h3 className="mb-2 px-4 text-xs uppercase text-gray-400">Account</h3>
          {accountItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>
      </nav>
    </aside>
  )
}