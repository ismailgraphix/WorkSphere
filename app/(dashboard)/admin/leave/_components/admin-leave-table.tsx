'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Loader2, Check, X } from "lucide-react"

interface LeaveApplication {
  id: string
  startDate: string
  endDate: string
  reason: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  employee: {
    id: string
    firstName: string
    lastName: string
    position: string
  }
  department: {
    id: string
    name: string
  }
}

export default function AdminLeaveTable() {
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchLeaveApplications()
  }, [])

  const fetchLeaveApplications = async () => {
    try {
      const response = await fetch('/api/leave')
      if (!response.ok) throw new Error('Failed to fetch leave applications')
      const data = await response.json()
      setLeaveApplications(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load leave applications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/leave/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) throw new Error('Failed to update leave application status')
      await fetchLeaveApplications() // Refresh the list
      toast({
        title: "Success",
        description: `Leave application ${status.toLowerCase()}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update leave application status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveApplications.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.employee.firstName} {leave.employee.lastName}</TableCell>
                <TableCell>{leave.department.name}</TableCell>
                <TableCell>{format(new Date(leave.startDate), 'PP')}</TableCell>
                <TableCell>{format(new Date(leave.endDate), 'PP')}</TableCell>
                <TableCell>{leave.reason}</TableCell>
                <TableCell>
                  <Badge variant={leave.status === 'PENDING' ? 'outline' : leave.status === 'APPROVED' ? 'default' : 'destructive'}>
                    {leave.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {leave.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleStatusUpdate(leave.id, 'APPROVED')}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(leave.id, 'REJECTED')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}