'use client'

import React, { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { format, differenceInDays } from "date-fns"
import { Calendar as CalendarIcon, Loader2, Search } from "lucide-react"

interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  position: string
  department: {
    id: string
    name: string
  }
  email: string
  phoneNumber: string
  employmentStatus: string
}

const leaveTypes = [
  "Annual Leave",
  "Sick Leave",
  "Personal Leave",
  "Maternity/Paternity Leave",
  "Bereavement Leave",
  "Unpaid Leave"
]

export default function LeaveApplicationForm() {
  const [searchId, setSearchId] = useState('')
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [leaveType, setLeaveType] = useState<string>('')
  const [reason, setReason] = useState('')
  const [isPaidLeave, setIsPaidLeave] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [createdById, setCreatedById] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCreatedById(user.id)
    }
  }, [])

  const searchEmployee = async () => {
    if (!searchId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an employee ID",
        variant: "destructive",
      })
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`/api/employees/${searchId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Employee not found')
        }
        throw new Error('Failed to fetch employee details')
      }
      const employeeData = await response.json()
      setEmployee(employeeData)

      // Fetch employee's leave history
      const leaveResponse = await fetch(`/api/leave/employee/${employeeData.id}`)
      if (leaveResponse.ok) {
        const leaveHistory = await leaveResponse.json()
        // You can set this to state if you want to display it
        console.log('Leave History:', leaveHistory)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to find employee",
        variant: "destructive",
      })
      setEmployee(null)
    } finally {
      setSearching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Submit attempted with createdById:', createdById)
    
    if (!createdById) {
      toast({
        title: "Error",
        description: "User session not found. Please log in again.",
        variant: "destructive",
      })
      return
    }

    if (!employee) {
      toast({
        title: "Error",
        description: "Please search for an employee first",
        variant: "destructive",
      })
      return
    }

    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      })
      return
    }

    if (!leaveType) {
      toast({
        title: "Error",
        description: "Please select a leave type",
        variant: "destructive",
      })
      return
    }

    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for leave",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employee.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          reason,
          leaveType,
          position: employee.position,
          departmentId: employee.department.id,
          isPaidLeave,
          createdById,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit leave application')
      }

      toast({
        title: "Success",
        description: "Leave application submitted successfully",
      })

      // Reset form
      setStartDate(undefined)
      setEndDate(undefined)
      setLeaveType('')
      setReason('')
      setIsPaidLeave(false)
      setEmployee(null)
      setSearchId('')
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit leave application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateLeaveDuration = () => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate) + 1
      return `${days} day${days > 1 ? 's' : ''}`
    }
    return 'N/A'
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Leave Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Search Section */}
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <div className="flex gap-2">
              <Input
                id="employeeId"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter employee ID"
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={searchEmployee}
                disabled={searching}
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="ml-2">Search</span>
              </Button>
            </div>
          </div>

          {/* Employee Details Section */}
          {employee && (
            <div className="grid gap-4 p-4 border rounded-lg bg-muted">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Position</Label>
                  <p className="font-medium">{employee.position}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Department</Label>
                  <p className="font-medium">{employee.department.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="font-medium">{employee.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Phone</Label>
                  <p className="font-medium">{employee.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <p className="font-medium">{employee.employmentStatus}</p>
                </div>
              </div>
            </div>
          )}

          {/* Leave Details Section */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Leave Duration</Label>
              <p className="font-medium">{calculateLeaveDuration()}</p>
            </div>

            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPaidLeave"
                checked={isPaidLeave}
                onCheckedChange={(checked) => setIsPaidLeave(checked as boolean)}
              />
              <Label htmlFor="isPaidLeave">Paid Leave</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for your leave request"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !employee}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Leave Application"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}