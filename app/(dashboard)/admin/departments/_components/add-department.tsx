"use client";
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function AddDepartmentModal() {
  const [name, setName] = useState("");
  const [departmentHeadId, setDepartmentHeadId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    // Fetch token from localStorage or context (replace 'your-token' with actual implementation)
    const token = localStorage.getItem("authToken");

    if (!name || !departmentHeadId) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "/api/departments",
        { name, departmentHeadId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Success handling
        setLoading(false);
        alert("Department added successfully!");
        // Reset form fields
        setName("");
        setDepartmentHeadId("");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to add department. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Add Department</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Department</AlertDialogTitle>
          <AlertDialogDescription>Enter the details of the new department.</AlertDialogDescription>
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
          {error && <p className="text-red-500">{error}</p>}
        </div>

        <AlertDialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Department"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
