'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"

interface Department {
  id: string
  name: string
}

interface Job {
  id: string
  title: string
  description: string
  requirements: string
  salary: number | null
  location: string | null
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'
  status: 'OPEN' | 'CLOSED' | 'DRAFT'
  departmentId: string
  createdAt: string
  updatedAt: string
}

export default function JobManagement() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    type: 'FULL_TIME',
    status: 'OPEN',
    departmentId: '',
  })

  useEffect(() => {
    fetchJobs()
    fetchDepartments()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      } else {
        throw new Error('Failed to fetch jobs')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      if (response.ok) {
        const data = await response.json()
        setDepartments(data)
      } else {
        throw new Error('Failed to fetch departments')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load departments. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = editingJob ? `/api/jobs/${editingJob.id}` : '/api/jobs'
      const method = editingJob ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salary: formData.salary ? parseFloat(formData.salary) : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Job ${editingJob ? 'updated' : 'created'} successfully`,
        })
        setIsDialogOpen(false)
        setEditingJob(null)
        setFormData({
          title: '',
          description: '',
          requirements: '',
          salary: '',
          location: '',
          type: 'FULL_TIME',
          status: 'OPEN',
          departmentId: '',
        })
        fetchJobs()
      } else {
        throw new Error(`Failed to ${editingJob ? 'update' : 'create'} job`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingJob ? 'update' : 'create'} job. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      salary: job.salary?.toString() || '',
      location: job.location || '',
      type: job.type,
      status: job.status,
      departmentId: job.departmentId,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (jobToDelete) {
      setLoading(true)
      try {
        const response = await fetch(`/api/jobs/${jobToDelete}`, { method: 'DELETE' })
        if (response.ok) {
          toast({
            title: "Success",
            description: "Job deleted successfully",
          })
          fetchJobs()
        } else {
          throw new Error('Failed to delete job')
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete job. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
        setIsDeleteDialogOpen(false)
        setJobToDelete(null)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Job Management
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingJob(null)
                setFormData({
                  title: '',
                  description: '',
                  requirements: '',
                  salary: '',
                  location: '',
                  type: 'FULL_TIME',
                  status: 'OPEN',
                  departmentId: '',
                })
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add New Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingJob ? 'Edit Job' : 'Add New Job'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="requirements" className="text-right">
                      Requirements
                    </Label>
                    <Textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="salary" className="text-right">
                      Salary
                    </Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select name="type" value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                        <SelectItem value="PART_TIME">Part Time</SelectItem>
                        <SelectItem value="CONTRACT">Contract</SelectItem>
                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select name="status" value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select job status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="departmentId" className="text-right">
                      Department
                    </Label>
                    <Select name="departmentId" value={formData.departmentId} onValueChange={(value) => setFormData(prev => ({ ...prev, departmentId: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingJob ? 'Update' : 'Create'} Job
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{departments.find(d => d.id === job.departmentId)?.name}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(job)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setJobToDelete(job.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to delete this job?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the job listing.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setJobToDelete(null)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}