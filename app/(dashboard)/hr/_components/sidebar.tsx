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
import { LayoutGrid, Users, FileText, Clock, CalendarCheck, TreePalm, Briefcase, GraduationCap, MessageSquare, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import WorkSphereLogo from '@/components/WorkSphereLogo'

const sidebarItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/hr' },
  { icon: Users, label: 'Employees', href: '/hr/employees' },
  { icon: FileText, label: 'Departments', href: '/hr/departments' },
  { icon: Clock, label: 'Attendance', href: '/hr/attendance' },
  { icon: TreePalm, label: 'Leave Management', href: '/hr/leave' },
  { icon: CalendarCheck, label: 'Holidays', href: '/hr/holidays' },
  { icon: Briefcase, label: 'Job Postings', href: '/hr/jobs' },
  { icon: GraduationCap, label: 'Training', href: '/hr/training' },
  { icon: MessageSquare, label: 'Employee Relations', href: '/hr/relations' },
]

const settingsItems = [
  { icon: Settings, label: 'Settings', href: '/hr/settings' },
]

export default function HRSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "relative flex flex-col h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-64"
      )}>
        <div className="flex items-center justify-between p-4">
          <Link href="/hr" className="flex items-center space-x-2">
            <WorkSphereLogo isCollapsed={isCollapsed} />
          </Link>
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
        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 rounded-md p-2 hover:bg-gray-700",
                      pathname === item.href && "bg-gray-700",
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
          <Separator className="my-4 bg-gray-700" />
          <div className="px-2">
            {!isCollapsed && (
              <h3 className="text-gray-400 uppercase text-xs mb-2 px-2">Settings</h3>
            )}
            <nav className="space-y-1">
              {settingsItems.map((item) => (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 rounded-md p-2 hover:bg-gray-700",
                        pathname === item.href && "bg-gray-700",
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
          </div>
        </ScrollArea>
      </aside>
    </TooltipProvider>
  )
}