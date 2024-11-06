'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

interface LeaveApplication {
  id: string
  startDate: string
  endDate: string
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  department: {
    name: string
  }
}

export default function EmployeeLeaveTable() {
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchLeaveApplications()
  }, [])

  const fetchLeaveApplications = async () => {
    try {
      const response = await fetch('/api/leave/employeee')
      if (!response.ok) throw new Error('Failed to fetch leave applications')
      const data = await response.json()
      setLeaveApplications(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your leave applications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Leave Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveApplications.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{format(new Date(leave.startDate), 'PP')}</TableCell>
                <TableCell>{format(new Date(leave.endDate), 'PP')}</TableCell>
                <TableCell>{leave.department.name}</TableCell>
                <TableCell>{leave.reason}</TableCell>
                <TableCell>
                  <Badge variant={leave.status === 'PENDING' ? 'outline' : leave.status === 'APPROVED' ? 'default' : 'destructive'}>
                    {leave.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}