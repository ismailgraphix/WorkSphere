'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Building2, CalendarCheck, DollarSign,   } from 'lucide-react'

const stats = [
  { title: "Total Employees", value: "248", icon: Users, change: "+12% from last month" },
  { title: "Open Positions", value: "15", icon: Building2, change: "+3 from last week" },
  { title: "Leave Requests", value: "24", icon: CalendarCheck, change: "6 pending approval" },
  { title: "Payroll", value: "$528,490", icon: DollarSign, change: "Next run on 30th" },
]

const recentActivities = [
  { action: "New employee onboarded", department: "Engineering", time: "2 hours ago" },
  { action: "Leave request approved", department: "Marketing", time: "4 hours ago" },
  { action: "Performance review completed", department: "Sales", time: "Yesterday" },
  { action: "New job posting created", department: "Human Resources", time: "2 days ago" },
  { action: "Payroll processed", department: "Finance", time: "3 days ago" },
]

export default function HRDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <ScrollArea className="h-screen">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
          <Button>Generate Report</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {recentActivities.map((activity, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.department}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Engineering", "Marketing", "Sales", "Finance", "HR"].map((dept) => (
                      <div key={dept} className="flex items-center space-x-2">
                        <div className="w-full">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{dept}</span>
                            <span className="text-muted-foreground">{Math.floor(Math.random() * 50 + 10)}%</span>
                          </div>
                          <Progress value={Math.random() * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Upcoming Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["John Doe", "Jane Smith", "Bob Johnson"].map((name) => (
                      <div key={name} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-muted" />
                          <span className="text-sm font-medium">{name}</span>
                        </div>
                        <Button size="sm">Schedule</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full">Post New Job</Button>
                  <Button className="w-full">Review Leave Requests</Button>
                  <Button className="w-full">Start Onboarding</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>Manage your workforce efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Employee management content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>View and manage company departments</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Department overview content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}