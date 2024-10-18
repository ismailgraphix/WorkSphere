import { toast } from 'react-toastify';
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export type Employee = {
  employeeId: string; // Using employeeId
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: string;
  department: { name: string };
  employmentStatus: "ACTIVE" | "SUSPENDED" | "TERMINATED";
}

export const columns: ColumnDef<Employee>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      const [isDialogOpen, setDialogOpen] = useState(false);
      const router = useRouter();

      const handleDelete = async () => {
        try {
          const response = await fetch(`/api/employees/${employee.employeeId}`, { method: 'DELETE' });
      
          if (!response.ok) {
            throw new Error('Failed to delete the employee');
          }
      
          toast.success("Employee deleted successfully");
          router.refresh(); // Refresh the page
      
        } catch (error) {
          toast.error("Error deleting employee");
          console.error("Error deleting employee:", error);
        } finally {
          setDialogOpen(false);
        }
      };

      const handleEdit = () => {
        console.log("Navigating to edit employee with ID:", employee.employeeId); // Log the employee ID
        router.push(`/admin/employees/${employee.employeeId}`);
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(employee.employeeId)}>
                View Employee
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit}>Edit Employee</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDialogOpen(true)}>Delete Employee</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogOverlay />
            <DialogContent>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the employee?
              </DialogDescription>
              <DialogFooter>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleDelete} variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
];
