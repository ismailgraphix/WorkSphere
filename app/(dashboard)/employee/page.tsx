"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, FileCheck, Building2 } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface EmployeeDashboardData {
  employee: {
    id: string
    firstName: string
    lastName: string
    position: string
    department: {
      name: string
    }
    dateOfJoining: string
  }
  leaveBalance: {
    annual: number
    sick: number
    used: number
  }
  recentLeaves: Array<{
    id: string
    startDate: string
    endDate: string
    leaveType: string
    status: string
  }>
  attendanceRate: number
  attendanceData: Array<{
    date: string
    status: "present" | "absent" | "weekend"
    checkIn: string | null
    checkOut: string | null
  }>
  upcomingHolidays: Array<{
    id: string
    title: string
    date: string
  }>
}

export default function EmployeeDashboard() {
  const [dashboardData, setDashboardData] = useState<EmployeeDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // In a real app, you would get the employeeId from the session
      // For demo purposes, we'll use a mock ID
      const employeeId = "employee-123"
      const response = await fetch(`/api/dashboard/employee?employeeId=${employeeId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      setError("Error fetching dashboard data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "#10b981"
      case "absent":
        return "#ef4444"
      case "weekend":
        return "#6b7280"
      default:
        return "#6b7280"
    }
  }

  const getLeaveStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500">Approved</Badge>
      case "REJECTED":
        return <Badge className="bg-red-500">Rejected</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-xl mb-4">Error: {error}</p>
        <Button onClick={fetchDashboardData}>Retry</Button>
      </div>
    )
  }

  // Early return if data is not available
  if (!dashboardData) {
    return null
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome, {dashboardData.employee.firstName}</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.employee.department.name}</div>
                <p className="text-xs text-muted-foreground mt-1">{dashboardData.employee.position}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.attendanceRate.toFixed(1)}%</div>
                <Progress className="mt-2" value={dashboardData.attendanceRate} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(dashboardData.leaveBalance.annual ?? 0) - (dashboardData.leaveBalance.used ?? 0)} days
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Used: {dashboardData.leaveBalance.used} / {dashboardData.leaveBalance.annual}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.recentLeaves.filter((leave) => leave.status === "PENDING").length}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Monthly Attendance</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dashboardData.attendanceData}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => new Date(value).getDate().toString()}
                    />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={() => ""} />
                    <Tooltip
                      contentStyle={{ background: "#333", border: "none" }}
                      labelStyle={{ color: "#fff" }}
                      formatter={(value, name, props) => {
                        const { payload } = props
                        return [
                          payload.status === "present"
                            ? `Check-in: ${payload.checkIn}, Check-out: ${payload.checkOut || "N/A"}`
                            : payload.status === "weekend"
                              ? "Weekend"
                              : "Absent",
                          "Status",
                        ]
                      }}
                      labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    />
                    <Bar dataKey="status" fill="#10b981" radius={[4, 4, 0, 0]} name="Status">
                      {dashboardData.attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {dashboardData.recentLeaves.slice(0, 3).map((leave) => (
                    <div key={leave.id} className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div className="ml-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium leading-none">{leave.leaveType} Leave</p>
                          {getLeaveStatusBadge(leave.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(leave.startDate).toLocaleDateString()} -{" "}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Requests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Holidays</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {dashboardData.upcomingHolidays.map((holiday) => (
                  <Card key={holiday.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{holiday.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {new Date(holiday.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

