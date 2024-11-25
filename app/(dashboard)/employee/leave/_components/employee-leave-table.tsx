import { useEffect, useState, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface LeaveData {
  id: string;
  startDate: Date;
  endDate: Date;
  type: string;
  status: string;
  reason: string;
  employeeId: string;
}

export default function EmployeeLeaveTable() {
  const [leaveApplications, setLeaveApplications] = useState<LeaveData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Wrap the fetchLeaveApplications function in useCallback
  const fetchLeaveApplications = useCallback(async () => {
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        throw new Error('User not found in localStorage');
      }

      const userData = JSON.parse(user);
      console.log('User Data:', userData);

      const employeeId = userData.id;
      if (!employeeId) {
        throw new Error('Employee ID not found in user data');
      }

      console.log('Fetching leaves for employee:', employeeId);

      const response = await fetch(`/api/leave/employee/${employeeId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch leave applications');
      }

      const data = await response.json();
      console.log('Received leave data:', data);
      setLeaveApplications(data);
    } catch (error) {
      console.error('Error fetching leave applications:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load your leave applications. Please try again.",
        variant: "destructive",
      });
      setLeaveApplications([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Pass fetchLeaveApplications as a dependency
  useEffect(() => {
    fetchLeaveApplications();
  }, [fetchLeaveApplications]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (leaveApplications.length === 0) {
    return <div>No leave applications found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaveApplications.map((leave) => (
          <TableRow key={leave.id}>
            <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
            <TableCell>{leave.type}</TableCell>
            <TableCell>{leave.status}</TableCell>
            <TableCell>{leave.reason}</TableCell>
            <TableCell>
              {/* Add your action buttons here */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
