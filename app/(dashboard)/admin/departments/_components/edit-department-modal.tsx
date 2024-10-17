"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Import the Shadcn Checkbox
import axios from "axios";
import { useToast } from "@/hooks/use-toast"; // Import the toast hook

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: {
    id: string;
    name: string;
    departmentHeadId: string;
    isActive: boolean;
  };
}

export const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({
  isOpen,
  onClose,
  department,
}) => {
  const { toast } = useToast(); // Initialize toast
  const [name, setName] = useState(department.name);
  const [departmentHeadId, setDepartmentHeadId] = useState(department.departmentHeadId);
  const [isActive, setIsActive] = useState(department.isActive);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setError("");
    setLoading(true);

    const token = localStorage.getItem("authToken");

    if (!name || !departmentHeadId) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `/api/departments/${department.id}`,
        { name, departmentHeadId, isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Department Updated",
          description: "The department has been successfully updated.",
          variant: "success", // You can define variants for styling
        });
        window.location.reload();
        setLoading(false);
        onClose();
      }
    } catch (error) {
      console.error(error);
      setError("Failed to update department. Please try again.");
      toast({
        title: "Error",
        description: "Failed to update department.",
        variant: "destructive", // Example variant for error
      });
      setLoading(false);
    }
  };

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
            type="text"
            placeholder="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Department Head ID"
            value={departmentHeadId}
            onChange={(e) => setDepartmentHeadId(e.target.value)}
          />
          <div className="flex items-center">
            <Checkbox
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked)}
            />
            <label className="ml-2">Activate</label>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <AlertDialogFooter>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Department"}
          </Button>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
