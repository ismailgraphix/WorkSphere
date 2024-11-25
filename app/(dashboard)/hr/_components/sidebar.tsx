'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Users, Building2, CalendarCheck, HandCoins, Clock, BarChartIcon as ChartBar, Settings, Menu } from 'lucide-react'
import WorkSphereLogo from '@/components/WorkSphereLogo'

const sidebarItems = [
  { icon: Users, label: 'Dashboard', href: '/hr' },
  { icon: Users, label: 'Employees', href: '/hr/employees' },
  { icon: Building2, label: 'Departments', href: '/hr/departments' },
  { icon: HandCoins, label: 'Payroll', href: '/hr/payroll' },
  { icon: Clock, label: 'Attendance', href: '/hr/attendance' },
  { icon: ChartBar, label: 'Reports', href: '/hr/reports' },
  { icon: CalendarCheck, label: 'Leave Management', href: '/hr/leave' },
  { icon: Settings, label: 'Settings', href: '/hr/settings' },
]

export default function HrSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn(
        "relative flex flex-col h-screen bg-background border-r",
        isCollapsed ? "w-[80px]" : "w-64"
      )}>
        <div className="flex items-center justify-between p-4">
          <Link href="/hr" className="flex items-center space-x-2">
            <WorkSphereLogo isCollapsed={isCollapsed} />
            {!isCollapsed && <h2 className="text-xl font-semibold"></h2>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href && "bg-accent text-accent-foreground",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </ScrollArea>
        <Separator className="my-2" />
        <div className="p-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : "Collapse"}
            <span className="sr-only">
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}