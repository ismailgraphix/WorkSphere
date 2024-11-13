'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, MoreHorizontal, ArrowUpDown } from 'lucide-react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

interface Department {
  id: string
  name: string
  departmentHead: {
    id: string
    name: string
    employeeId: string
  } | null
  isActive: boolean
}

const AddDepartmentModal: React.FC<{ onDepartmentAdded: () => void }> = ({ onDepartmentAdded }) => {
  const [name, setName] = useState("")
  const [departmentHeadEmployeeId, setDepartmentHeadEmployeeId] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    setError("")
    setLoading(true)

    if (!name || !departmentHeadEmployeeId) {
      setError("Please fill all required fields.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        "/api/departments",
        { name, departmentHeadEmployeeId, isActive },
        { withCredentials: true }
      )

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Department added successfully!",
        })
        onDepartmentAdded()
        setIsOpen(false)
        setName("")
        setDepartmentHeadEmployeeId("")
        setIsActive(true)
      }
    } catch (error) {
      console.error("Error adding department:", error)
      toast({
        title: "Error",
        description: "Failed to add department. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Add Department</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Department</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the details of the new department.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Department Head Employee ID"
            value={departmentHeadEmployeeId}
            onChange={(e) => setDepartmentHeadEmployeeId(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <label htmlFor="isActive">Activate Department</label>
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Adding..." : "Add Department"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const EditDepartmentModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  department: Department
  onDepartmentUpdated: () => void
}> = ({ isOpen, onClose, department, onDepartmentUpdated }) => {
  const [name, setName] = useState(department.name)
  const [departmentHeadId, setDepartmentHeadId] = useState(department.departmentHead?.employeeId || "")
  const [isActive, setIsActive] = useState(department.isActive)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleUpdate = async () => {
    setError("")
    setLoading(true)

    if (!name) {
      setError("Please fill in the department name.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.put(
        `/api/departments/${department.id}`,
        { name, departmentHeadEmployeeId: departmentHeadId, isActive },
        { withCredentials: true }
      )

      if (response.status === 200) {
        toast({
          title: "Department Updated",
          description: "The department has been successfully updated.",
        })
        onDepartmentUpdated()
        onClose()
      }
    } catch (error) {
      console.error("Error updating department:", error)
      toast({
        title: "Error",
        description: "Failed to update department. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Department</AlertDialogTitle>
          <AlertDialogDescription>
            Update the details of the department.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Department Head Employee ID"
            value={departmentHeadId}
            onChange={(e) => setDepartmentHeadId(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <label htmlFor="isActive">Activate</label>
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update Department"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null)
  const [deletingDepartment, setDeletingDepartment] = useState<string | null>(null)

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/departments', { withCredentials: true })
      setDepartments(response.data)
    } catch (error) {
      console.error('Error fetching departments:', error)
      toast({
        title: "Error",
        description: "Failed to fetch departments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const columns: ColumnDef<Department>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorFn: (row) => row.departmentHead ? row.departmentHead.name : null,
      header: "Department Head",
      cell: (info) => info.getValue() || "No Head Assigned",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "success" : "destructive"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const department = row.original

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setEditingDepartment(department.id)}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDeletingDepartment(department.id)}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <EditDepartmentModal
              isOpen={editingDepartment === department.id}
              onClose={() => setEditingDepartment(null)}
              department={department}
              onDepartmentUpdated={fetchDepartments}
            />

            <AlertDialog 
              open={deletingDepartment === department.id} 
              onOpenChange={() => setDeletingDepartment(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this department?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the department and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(department.id)} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )
      }
    },
  ]

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
 
  const table = useReactTable({
    data: departments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const handleDelete = async (departmentId: string) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/departments/${departmentId}`, {
        withCredentials: true
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Department deleted successfully.",
        });
        await fetchDepartments(); // Refresh the departments list
      }
    } catch (error: any) {
      console.error("Error deleting department:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete department. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeletingDepartment(null); // Close the delete dialog
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Departments</CardTitle>
        <CardDescription>Manage your organization &apos;s departments</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between py-4">
              <Input
                placeholder="Filter Departments"
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                className="max-w-sm"
              />
              <AddDepartmentModal onDepartmentAdded={fetchDepartments} />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}