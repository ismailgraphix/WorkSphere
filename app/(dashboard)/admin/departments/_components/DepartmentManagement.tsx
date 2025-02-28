'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
import { Department } from '@/types/department'
import { AddDepartmentModal } from './AddDepartmentModal'
import { EditDepartmentModal } from './EditDepartmentModal'

interface DepartmentWithDetails extends Department {
  departmentHead: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    name: string;
  } | null;
  employees: Array<{
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    name: string;
  }>;
  leaves: Array<{
    id: string;
    startDate: Date;
    endDate: Date;
    status: string;
    employee: {
      firstName: string;
      lastName: string;
      employeeId: string;
      name: string;
    };
  }>;
}

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<DepartmentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null)
  const [deletingDepartment, setDeletingDepartment] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [viewingDepartment, setViewingDepartment] = useState<DepartmentWithDetails | null>(null)

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get<DepartmentWithDetails[]>('/api/departments', { withCredentials: true })
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
  }, [toast])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

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
        await fetchDepartments();
      }
    } catch (error: unknown) {
      console.error("Error deleting department:", error);
      if (error instanceof Error) {
        toast({
          title: "Error",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: (error as any).response?.data?.error || "Failed to delete department. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setDeletingDepartment(null);
    }
  };

  const fetchDepartmentDetails = async (departmentId: string) => {
    try {
      const response = await axios.get(`/api/departments/${departmentId}`);
      console.log('Department Details Response:', response.data);
      setViewingDepartment(response.data);
    } catch (error) {
      console.error('Error fetching department details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch department details.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<DepartmentWithDetails>[] = [
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
      accessorFn: (row) => row.departmentHead?.name || "No Head Assigned",
      header: "Department Head",
      cell: (info) => info.getValue(),
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
                <DropdownMenuItem onClick={() => fetchDepartmentDetails(department.id)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditingDepartment(department.id)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDeletingDepartment(department.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={viewingDepartment?.id === department.id} onOpenChange={() => setViewingDepartment(null)}>
              <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>Department Details</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Department Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">Name:</p>
                            <p>{viewingDepartment?.name}</p>
                          </div>
                          
                          <div>
                            <p className="font-medium">Status:</p>
                            <p>
                              <Badge variant={viewingDepartment?.isActive ? "success" : "destructive"}>
                                {viewingDepartment?.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Employees</h3>
                        <div className="max-h-40 overflow-y-auto">
                          {viewingDepartment?.employees?.length ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Employee ID</TableHead>
                                  <TableHead>Name</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {viewingDepartment.employees.map((employee) => (
                                  <TableRow key={employee.id}>
                                    <TableCell>{employee.employeeId}</TableCell>
                                    <TableCell>{employee.name}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <p>No employees in this department</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Recent Leave Applications</h3>
                        <div className="max-h-40 overflow-y-auto">
                          {viewingDepartment?.leaves?.length ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Employee</TableHead>
                                  <TableHead>Start Date</TableHead>
                                  <TableHead>End Date</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {viewingDepartment.leaves.map((leave) => (
                                  <TableRow key={leave.id}>
                                    <TableCell>{leave.employee.name}</TableCell>
                                    <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                      <Badge variant={leave.status === 'APPROVED' ? 'success' : 
                                                 leave.status === 'PENDING' ? 'default' : 'destructive'}>
                                        {leave.status}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <p>No leave applications found</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <EditDepartmentModal
              isOpen={editingDepartment === department.id}
              onClose={() => setEditingDepartment(null)}
              department={department}
              onDepartmentUpdated={fetchDepartments}
            />

            <AlertDialog 
              open={deletingDepartment
=== department.id} 
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

  const table = useReactTable<DepartmentWithDetails>({
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Departments</CardTitle>
        <CardDescription>Manage your organization&apos;s departments</CardDescription>
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

