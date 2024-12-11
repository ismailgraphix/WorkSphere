'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Clock, Calendar } from 'lucide-react'
import { format } from 'date-fns'

interface AttendanceRecord {
  id: string
  date: string
  checkIn: string
  checkOut: string | null
}

export default function EmployeeAttendance() {
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null)
  const [recentRecords, setRecentRecords] = useState<AttendanceRecord[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    fetchTodayRecord()
    fetchRecentRecords()
    return () => clearInterval(timer)
  }, [])

  const fetchTodayRecord = async () => {
    try {
      const response = await fetch('/api/attendance')
      if (response.ok) {
        const data = await response.json()
        const today = new Date().toDateString()
        const todayRecord = data.find((record: AttendanceRecord) => 
          new Date(record.date).toDateString() === today
        )
        setTodayRecord(todayRecord || null)
      }
    } catch (error) {
      console.error('Error fetching today\'s record:', error)
    }
  }

  const fetchRecentRecords = async () => {
    try {
      const response = await fetch('/api/attendance')
      if (response.ok) {
        const data = await response.json()
        setRecentRecords(data)
      }
    } catch (error) {
      console.error('Error fetching recent records:', error)
    }
  }

  const handleAttendance = async (type: 'checkIn' | 'checkOut') => {
    setLoading(true)
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      if (response.ok) {
        const data = await response.json()
        setTodayRecord(prevRecord => ({
          ...prevRecord,
          ...data,
          [type]: new Date(data[type]).toISOString()
        }))
        toast({
          title: "Success",
          description: `${type === 'checkIn' ? 'Checked in' : 'Checked out'} successfully`,
        })
        fetchRecentRecords()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to register attendance')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register attendance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{format(currentTime, 'HH:mm:ss')}</div>
              <div>{format(currentTime, 'EEEE, MMMM d, yyyy')}</div>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => handleAttendance('checkIn')}
                disabled={loading || !!todayRecord?.checkIn}
                className="flex-1"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
                Check In
              </Button>
              <Button
                onClick={() => handleAttendance('checkOut')}
                disabled={loading || !todayRecord?.checkIn || !!todayRecord?.checkOut}
                className="flex-1"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
                Check Out
              </Button>
            </div>
            {todayRecord && (
              <div className="text-sm text-muted-foreground">
                {todayRecord.checkIn && <p>Checked in at: {format(new Date(todayRecord.checkIn), 'HH:mm:ss')}</p>}
                {todayRecord.checkOut && <p>Checked out at: {format(new Date(todayRecord.checkOut), 'HH:mm:ss')}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRecords.map((record) => (
              <div key={record.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{format(new Date(record.date), 'MMMM d, yyyy')}</p>
                  <p className="text-sm text-muted-foreground">
                    Check In: {format(new Date(record.checkIn), 'HH:mm:ss')}
                    {record.checkOut && ` | Check Out: ${format(new Date(record.checkOut), 'HH:mm:ss')}`}
                  </p>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}