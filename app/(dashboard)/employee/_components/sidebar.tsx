'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Settings,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import WorkSphereLogo from '@/components/WorkSphereLogo'

export default function EmployeeSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const mainMenuItems = [
    { href: '/employee', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/employee/leave', icon: Calendar, label: 'Leave Management' },
    { href: '/employee/holidays', icon: CalendarDays, label: 'Holidays' },
    { href: '/employee/attendance', icon: Clock, label: 'Attendance' },
   
    
    
  ]

  const accountItems = [
  
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<any>; label: string }) => {
    const isActive = pathname === href
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-all hover:text-gray-100",
                isActive ? "bg-gray-700 text-gray-100" : "hover:bg-gray-700",
                isCollapsed && "justify-center"
              )}
            >
              <Icon className="h-4 w-4" />
              {!isCollapsed && <span>{label}</span>}
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
    <aside className={cn(
      "flex h-screen flex-col bg-gray-800 text-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-[80px]" : "w-64"
    )}>
      <div className="flex items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2">
          <WorkSphereLogo isCollapsed={isCollapsed} />
          {!isCollapsed && <h2 className="text-xl font-semibold"></h2>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-gray-700"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className="sr-only">
            {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col flex-1">
          <div className="flex-1">
            {!isCollapsed && <h3 className="mb-2 px-4 text-xs uppercase text-gray-400">Main Menu</h3>}
            {mainMenuItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-700">
            {!isCollapsed && <h3 className="mb-2 px-4 text-xs uppercase text-gray-400">Account</h3>}
            {accountItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>
        </nav>
      </ScrollArea>
    </aside>
  )
}