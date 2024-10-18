import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge"; 
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
import { Checkbox } from "@/components/ui/checkbox"

export type Employee = {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: string;
  department: { name: string }; // Use department name instead of ID
  employmentStatus: "ACTIVE" | "SUSPENDED" | "TERMINATED"; // Add employmentStatus here
};

export const columns: ColumnDef<Employee>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
  },
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
    accessorKey: "department.name", // Access nested department name
    header: "Department",
    cell: ({ row }) => row.original.department.name, // Display department name
  },
  {
    accessorKey: "employmentStatus", // Add employment status
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.employmentStatus;
      let color = "gray"; // Default color

      // Determine the color based on the status
      switch (status) {
        case "ACTIVE":
          color = "green"; // Active status
          break;
        case "SUSPENDED":
          color = "yellow"; // Suspended status
          break;
        case "TERMINATED":
          color = "red"; // Terminated status
          break;
        default:
          color = "gray"; // Fallback color
      }
      
      // Return a styled badge for each status
      return (
        <Badge
          variant="outline"
          style={{
            backgroundColor: color,
            color: "white",
            padding: "0.3rem 0.6rem",
            borderRadius: "0.85rem",
            fontSize: "0.85rem",
            fontWeight: "bold",
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              View Employee
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Employee</DropdownMenuItem>
            <DropdownMenuItem>Delete Employee</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },

];
