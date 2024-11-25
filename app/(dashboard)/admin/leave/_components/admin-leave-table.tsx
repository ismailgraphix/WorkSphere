"use client"
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Loader2, Eye } from "lucide-react";

interface LeaveApplication {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
  };
  department: {
    id: string;
    name: string;
  };
}

export default function AdminLeaveTable() {
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();

  // Stable fetch function using useCallback
  const fetchLeaveApplications = useCallback(async () => {
    try {
      const response = await fetch('/api/leave');
      if (!response.ok) throw new Error('Failed to fetch leave applications');
      const data = await response.json();
      setLeaveApplications(data);
    } catch (error) {
      console.error("Error occurred", error);
      toast({
        title: "Error",
        description: "Failed to load leave applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLeaveApplications();
  }, [fetchLeaveApplications]);

  const handleStatusUpdate = async (leaveId: string, employeeId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      console.log('Updating leave:', { leaveId, employeeId, status });

      const response = await fetch(`/api/leave/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          leaveId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update leave application status');
      }

      await fetchLeaveApplications();
      setIsViewModalOpen(false);

      toast({
        title: "Success",
        description: `Leave application ${status.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Status update error:', error);
      toast({
        title: "Error",
        description: "Failed to update leave application status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewLeave = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setIsViewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Leave Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveApplications.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>{leave.employee.firstName} {leave.employee.lastName}</TableCell>
                  <TableCell>{leave.department.name}</TableCell>
                  <TableCell>{format(new Date(leave.startDate), 'PP')}</TableCell>
                  <TableCell>{format(new Date(leave.endDate), 'PP')}</TableCell>
                  <TableCell>
                    <Badge variant={leave.status === 'PENDING' ? 'outline' : leave.status === 'APPROVED' ? 'default' : 'destructive'}>
                      {leave.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => handleViewLeave(leave)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Leave Application Details</DialogTitle>
          </DialogHeader>

          {selectedLeave && (
            <div className="space-y-6">
              {/* Details of selected leave */}
              {selectedLeave.status === 'PENDING' && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate(selectedLeave.id, selectedLeave.employee.id, 'REJECTED')}
                    className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
                  >
                    Reject Leave
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedLeave.id, selectedLeave.employee.id, 'APPROVED')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve Leave
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
