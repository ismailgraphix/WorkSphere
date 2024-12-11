"use client"
import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Loader2 } from "lucide-react"

interface Holiday {
  id: string
  title: string
  date: string
  isRecurring: boolean
  createdBy: { name: string }
  updatedBy: { name: string }
}

export default function HolidayManager() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPastHolidays, setShowPastHolidays] = useState(false)
  const [newHoliday, setNewHoliday] = useState({ title: '', date: '', isRecurring: false })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { toast } = useToast()

  // Memoize fetchHolidays using useCallback
  const fetchHolidays = useCallback(async () => {
    try {
      const response = await fetch('/api/holidays')
      if (!response.ok) throw new Error('Failed to fetch holidays')
      const data = await response.json()
      setHolidays(data)
    } catch (error) {
      console.error('Error fetching holidays:', error)
      toast({
        title: "Error",
        description: "Failed to load holidays. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast]) // Ensure fetchHolidays is updated if toast changes

  useEffect(() => {
    fetchHolidays() // Call the memoized function on mount
  }, [fetchHolidays]) // Include fetchHolidays in the dependency array

  const addHoliday = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHoliday),
      })
      if (!response.ok) throw new Error('Failed to add holiday')
      await fetchHolidays() // Call fetchHolidays after adding a holiday
      setIsAddModalOpen(false)
      setNewHoliday({ title: '', date: '', isRecurring: false })
      toast({
        title: "Success",
        description: "Holiday added successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error('Error adding holiday:', error)
      toast({
        title: "Error",
        description: "Failed to add holiday. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredHolidays = holidays.filter(holiday => {
    const matchesSearch = holiday.title.toLowerCase().includes(searchTerm.toLowerCase())
    const isPast = new Date(holiday.date) < new Date()
    return matchesSearch && (showPastHolidays || !isPast)
  })

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search holidays..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" /> Add New Holiday
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Holiday</DialogTitle>
            </DialogHeader>
            <form onSubmit={addHoliday} className="space-y-4">
              <div>
                <Label htmlFor="title">Holiday Name</Label>
                <Input
                  id="title"
                  value={newHoliday.title}
                  onChange={(e) => setNewHoliday({ ...newHoliday, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRecurring"
                  checked={newHoliday.isRecurring}
                  onCheckedChange={(checked) => setNewHoliday({ ...newHoliday, isRecurring: checked as boolean })}
                />
                <Label htmlFor="isRecurring">Is Recurring</Label>
              </div>
              <Button type="submit">Add Holiday</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>Holiday Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHolidays.map((holiday) => (
            <TableRow key={holiday.id}>
              <TableCell>{format(new Date(holiday.date), 'MMMM dd, yyyy')}</TableCell>
              <TableCell>{format(new Date(holiday.date), 'EEEE')}</TableCell>
              <TableCell>{holiday.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center space-x-2">
        <Button
          variant={showPastHolidays ? "default" : "outline"}
          onClick={() => setShowPastHolidays(false)}
        >
          Upcoming
        </Button>
        <Button
          variant={showPastHolidays ? "outline" : "default"}
          onClick={() => setShowPastHolidays(true)}
        >
          Past Holidays
        </Button>
      </div>
    </div>
  )
}
