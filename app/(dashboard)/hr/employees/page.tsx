"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { Employee } from "./_components/columns";
import { Loader2 } from "lucide-react";

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch employee data from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees"); // Ensure the correct API route
        const data = await response.json();
        setEmployees(data); // Assuming the API returns an array of employees
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Employees</h1>
      <DataTable columns={columns} data={employees} />
    </div>
  );
}
