import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export type Employee = {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: string;
  department: { name: string };
  employmentStatus: "ACTIVE" | "SUSPENDED" | "TERMINATED";
};

const ActionsCell: React.FC<{ employee: Employee }> = ({ employee }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/employees/${employee.employeeId}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete the employee");
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
    router.push(`/admin/employees/${employee.employeeId}`);
  };

  const handleView = () => {
    router.push(`/admin/employees/${employee.employeeId}/view`);
  };

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
          <DropdownMenuItem onClick={handleView}>View Employee</DropdownMenuItem>
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
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "department.name",
    header: "Department",
  },
  {
    accessorKey: "employmentStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.employmentStatus;
      return (
        <Badge
          variant={
            status === "ACTIVE"
              ? "success"
              : status === "SUSPENDED"
              ? "outline"
              : "destructive"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell employee={row.original} />,
  },
];
