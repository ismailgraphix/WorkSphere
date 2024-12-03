'use client'

import { useEffect, useState, useCallback } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Loader2 } from 'lucide-react'
import { format } from "date-fns"

interface LeaveData {
  id: string
  startDate: string
  endDate: string
  leaveType: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reason: string
  rejectionReason?: string
  employee: {
    firstName: string
    lastName: string
  }
  department: {
    name: string
  }
}

export default function EmployeeLeaveTable() {
  const [leaveApplications, setLeaveApplications] = useState<LeaveData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchLeaveApplications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get user from localStorage
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        throw new Error('User not found in localStorage')
      }

      const user = JSON.parse(userStr)
      console.log('User Data:', user)

      if (!user.employee?.id) {
        throw new Error('Employee record not found')
      }

      console.log('Fetching leaves for employee:', user.employee.id)

      const response = await fetch(`/api/leave/employee/${user.employee.id}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch leave applications')
      }

      const data = await response.json()
      console.log('Received leave data:', data)
      setLeaveApplications(data)
    } catch (error) {
      console.error('Error fetching leave applications:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load leave applications'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchLeaveApplications()
  }, [fetchLeaveApplications])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button onClick={fetchLeaveApplications} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (leaveApplications.length === 0) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-32">
          <p className="text-muted-foreground">No leave applications found.</p>
        </CardContent>
      </Card>
    )
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
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveApplications.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{format(new Date(leave.startDate), 'PP')}</TableCell>
                <TableCell>{format(new Date(leave.endDate), 'PP')}</TableCell>
                <TableCell>{leave.leaveType}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      leave.status === 'PENDING'
                        ? 'outline'
                        : leave.status === 'APPROVED'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {leave.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={leave.reason}>
                  {leave.reason}
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}