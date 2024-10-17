"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast"; // Optional: for displaying toasts

interface Department {
  id: string;
  name: string;
}

export default function EmployeeRegistrationForm() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const { toast } = useToast();

  // Fetch active departments (replace with your API route)
  useEffect(() => {
    async function fetchDepartments() {
      const res = await fetch("/api/departments?active=true");
      const data = await res.json();
      setDepartments(data);
    }

    fetchDepartments();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Add your form submission logic here
    toast({ title: "Form submitted!" });
  };

  return (
    <ScrollArea className="h-[80vh] w-full p-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
              <Input id="firstName" placeholder="First Name" required />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
              <Input id="lastName" placeholder="Last Name" required />
            </div>

            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" placeholder="Middle Name" />
            </div>

            <div>
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input id="email" type="email" placeholder="Email" required />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
              <Input id="phoneNumber" placeholder="Phone Number" required />
            </div>

            <div>
              <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
              <Select id="gender" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
              <Input id="dateOfBirth" type="date" required />
            </div>

            <div>
              <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
              <Textarea id="address" placeholder="Address" required />
            </div>

            <div>
              <Label htmlFor="nationalID">National ID <span className="text-red-500">*</span></Label>
              <Input id="nationalID" placeholder="National ID" required />
            </div>
          </div>
        </div>

        {/* Employment Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Employment Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
              <Select id="department" required>
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

            <div>
              <Label htmlFor="position">Position <span className="text-red-500">*</span></Label>
              <Input id="position" placeholder="Position" required />
            </div>

            <div>
              <Label htmlFor="dateOfJoining">Date of Joining <span className="text-red-500">*</span></Label>
              <Input id="dateOfJoining" type="date" required />
            </div>

            <div>
              <Label htmlFor="employmentType">Employment Type <span className="text-red-500">*</span></Label>
              <Select id="employmentType" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salary">Salary (Optional)</Label>
              <Input id="salary" type="number" placeholder="Salary" />
            </div>

            <div>
              <Label htmlFor="currency">Currency (Optional)</Label>
              <Select id="currency">
                <SelectTrigger>
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select id="employmentStatus">
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="TERMINATED">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Emergency Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Emergency Contact Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContactName">Emergency Contact Name <span className="text-red-500">*</span></Label>
              <Input id="emergencyContactName" placeholder="Emergency Contact Name" required />
            </div>

            <div>
              <Label htmlFor="emergencyContactPhone">Emergency Contact Phone <span className="text-red-500">*</span></Label>
              <Input id="emergencyContactPhone" placeholder="Emergency Contact Phone" required />
            </div>

            <div>
              <Label htmlFor="emergencyContactRelationship">Relationship <span className="text-red-500">*</span></Label>
              <Input id="emergencyContactRelationship" placeholder="Relationship" required />
            </div>
          </div>
        </div>

        {/* Profile & Documents Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile & Documents</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profileImage">Profile Image</Label>
              <Input id="profileImage" type="file" accept="image/*" />
            </div>

            <div>
              <Label htmlFor="additionalDocuments">Additional Documents</Label>
              <Input id="additionalDocuments" type="file" accept="application/pdf" multiple />
            </div>
          </div>
        </div>

        <Button type="submit">Register Employee</Button>
      </form>
    </ScrollArea>
  );
}
