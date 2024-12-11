'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from '@/components/ui/scroll-area'
import {  CalendarIcon, Clock, FileText, Wallet, Building2, CalendarDays } from 'lucide-react'

export default function EmployeeDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, John</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 days</div>
              <p className="text-xs text-muted-foreground">2 days used this year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <p className="text-xs text-muted-foreground">4% improvement from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Payslip</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,250</div>
              <p className="text-xs text-muted-foreground">Paid on 1st June 2023</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Action required</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: CalendarDays, text: "Company Picnic - July 15th" },
                  { icon: Clock, text: "Quarterly Review - August 1st" },
                  { icon: Building2, text: "Department Meeting - Tomorrow at 10 AM" },
                  { icon: CalendarIcon, text: "Your Leave Request (July 20-22) - Pending Approval" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Your schedule at a glance</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Department Updates</CardTitle>
              <CardDescription>Latest news from your department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">New project kickoff meeting scheduled for next week.</p>
                <p className="text-sm">Team performance exceeded targets by 15% this quarter.</p>
                <p className="text-sm">Welcoming new team member, Sarah, joining us next Monday.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used employee actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button className="w-full">Request Leave</Button>
                <Button className="w-full">Submit Timesheet</Button>
                <Button className="w-full">View Latest Payslip</Button>
                <Button className="w-full">Update Documents</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  )
}