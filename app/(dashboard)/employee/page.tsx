'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Bell, Clock, DollarSign, FileText, Users } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function EmployeeDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="p-6 space-y-6">
        <ScrollArea>

       
      <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours Worked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">164.5 hrs</div>
            <p className="text-xs text-muted-foreground">+2.5 hrs from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 days</div>
            <p className="text-xs text-muted-foreground">2 days used this year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,250</div>
            <p className="text-xs text-muted-foreground">To be paid on 30th June</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 high priority</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: Bell, text: "New announcement: Company picnic next month" },
                { icon: Users, text: "You've been added to 'Project X' team" },
                { icon: FileText, text: "Your leave request for July 15th has been approved" },
                { icon: Clock, text: "Reminder: Team meeting at 3 PM today" },
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
            <CardDescription>Your upcoming events and deadlines</CardDescription>
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
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Your current project completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Project A", progress: 75 },
                { name: "Project B", progress: 50 },
                { name: "Project C", progress: 25 },
              ].map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.progress}%</p>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              ))}
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
              <Button className="w-full">View Payslip</Button>
              <Button className="w-full">Book Meeting Room</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </ScrollArea>
    </div>
  )
}