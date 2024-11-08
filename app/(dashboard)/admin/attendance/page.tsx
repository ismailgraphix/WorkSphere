'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Calendar, Search } from "lucide-react"
import { format } from 'date-fns'

interface AttendanceRecord {
  id: string
  userId: string
  userName: string
  date: string
  checkIn: string
  checkOut: string | null
}

export default function AdminHrAttendance() {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const { toast } = useToast()

  useEffect(() => {
    fetchAttendanceRecords()
  }, [])

  const fetchAttendanceRecords = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/attendance/all')
      if (response.ok) {
        const data = await response.json()
        setRecords(data)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch attendance records')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch attendance records. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const recordDate = new Date(record.date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(lastWeek.getDate() - 7)

    switch (dateFilter) {
      case 'today':
        return matchesSearch && recordDate.toDateString() === today.toDateString()
      case 'yesterday':
        return matchesSearch && recordDate.toDateString() === yesterday.toDateString()
      case 'lastWeek':
        return matchesSearch && recordDate >= lastWeek && recordDate <= today
      default:
        return matchesSearch
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="search">Search by Name</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-[200px]">
              <Label htmlFor="dateFilter">Date Filter</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger id="dateFilter">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="lastWeek">Last 7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.userName}</TableCell>
                    <TableCell>{format(new Date(record.date), 'MMMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(record.checkIn), 'HH:mm:ss')}</TableCell>
                    <TableCell>
                      {record.checkOut ? format(new Date(record.checkOut), 'HH:mm:ss') : 'Not checked out'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}