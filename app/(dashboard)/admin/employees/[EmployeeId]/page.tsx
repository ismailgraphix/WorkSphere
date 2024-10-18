"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

export default function EditEmployeeForm() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();

  // Ensure employeeId is being captured from the URL
  const employeeId = params.employeeId as string;
  console.log("Employee ID:", employeeId); // Debugging log

  useEffect(() => {
    if (!employeeId) {
      console.error("Employee ID is undefined");
      setLoading(false); // Stop loading if ID is not found
      return;
    }

    async function fetchEmployeeAndDepartments() {
      try {
        const [employeeRes, departmentsRes] = await Promise.all([
          fetch(`/api/employees/${employeeId}`),
          fetch("/api/departments"),
        ]);

        // Check responses
        if (!employeeRes.ok) throw new Error("Failed to fetch employee");
        if (!departmentsRes.ok) throw new Error("Failed to fetch departments");

        const employeeData = await employeeRes.json();
        const departmentsData = await departmentsRes.json();

        // Log fetched data
        console.log("Fetched employee data:", employeeData);
        console.log("Fetched departments data:", departmentsData);

        setEmployee(employeeData);
        setDepartments(departmentsData.filter((dept: Department) => dept.isActive));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load employee data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    }

    fetchEmployeeAndDepartments();
  }, [employeeId, toast]);

  if (loading) return <div>Loading...</div>; // Show loading state
  if (!employee) return <div>Employee not found</div>;

  return (
    <ScrollArea className="h-[80vh] w-full p-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
              <Input id="firstName" name="firstName" defaultValue={employee.firstName} required />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
              <Input id="lastName" name="lastName" defaultValue={employee.lastName} required />
            </div>
            {/* Add more fields here based on your Employee model */}
          </div>
        </div>

        {/* Employment Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Employment Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
              <Select name="departmentId" defaultValue={employee.departmentId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Add more fields here based on your Employee model */}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
}
