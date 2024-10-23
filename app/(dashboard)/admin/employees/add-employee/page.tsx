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
  isActive: boolean;
}

export default function EmployeeRegistrationForm() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch only active departments
  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();

        // Filter to include only active departments
        const activeDepartments = data.filter((dept: Department) => dept.isActive);
        setDepartments(activeDepartments);
      } catch (error) {
        toast({
          title: "Error fetching departments",
          description: "Could not load departments. Please try again.",
          variant: "destructive",
        });
      }
    }

    fetchDepartments();
  }, []);

  // Form submission logic
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target as HTMLFormElement);

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        body: JSON.stringify({
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          middleName: formData.get("middleName"),
          email: formData.get("email"),
          phoneNumber: formData.get("phoneNumber"),
          gender: formData.get("gender"),
          dateOfBirth: formData.get("dateOfBirth"),
          address: formData.get("address"),
          nationalID: formData.get("nationalID"),
          departmentId: formData.get("department"),
          position: formData.get("position"),
          dateOfJoining: formData.get("dateOfJoining"),
          employmentType: formData.get("employmentType"),
          maritalStatus: formData.get("maritalStatus"),
          emergencyContactName: formData.get("emergencyContactName"),
          emergencyContactPhone: formData.get("emergencyContactPhone"),
          emergencyContactRelationship: formData.get("emergencyContactRelationship"),
          salary: formData.get("salary"),
          currency: formData.get("currency"),
          employmentStatus: formData.get("employmentStatus"),
          isProbation: formData.get("isProbation"),
          probationEndDate: formData.get("probationEndDate"),
          contractEndDate: formData.get("contractEndDate"),
          bankName: formData.get("bankName"),
          bankAccountNumber: formData.get("bankAccountNumber"),
          bankBranch: formData.get("bankBranch"),
          taxID: formData.get("taxID"),
          socialSecurityNumber: formData.get("socialSecurityNumber"),
          profileImage: formData.get("profileImage"),  // Add this line
          resumeLink: formData.get("resumeLink"),      // Add this line
          contractLink: formData.get("contractLink"),   // Add this line
          identityDocumentLink: formData.get("identityDocumentLink"), // Add this line
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: "Employee registered successfully.",
          variant: "default",
        });
        // Optionally, reset form fields here
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to register employee.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while submitting the form.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              <Input id="firstName" name="firstName" placeholder="First Name" required />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
              <Input id="lastName" name="lastName" placeholder="Last Name" required />
            </div>

            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" name="middleName" placeholder="Middle Name" />
            </div>

            <div>
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input id="email" name="email" type="email" placeholder="Email" required />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
              <Input id="phoneNumber" name="phoneNumber" placeholder="Phone Number" required />
            </div>

            <div>
              <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
              <Select name="gender" required>
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
              <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
            </div>

            <div>
              <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
              <Textarea id="address" name="address" placeholder="Address" required />
            </div>

            <div>
              <Label htmlFor="nationalID">National ID <span className="text-red-500">*</span></Label>
              <Input id="nationalID" name="nationalID" placeholder="National ID" required />
            </div>

            <div>
              <Label htmlFor="maritalStatus">Marital Status <span className="text-red-500">*</span></Label>
              <Select name="maritalStatus" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MARRIED">Married</SelectItem>
                  <SelectItem value="DIVORCED">Divorced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Employment Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Employment Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
              <Select name="department" required>
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
              <Input id="position" name="position" placeholder="Position" required />
            </div>

            <div>
              <Label htmlFor="dateOfJoining">Date of Joining <span className="text-red-500">*</span></Label>
              <Input id="dateOfJoining" name="dateOfJoining" type="date" required />
            </div>

            <div>
              <Label htmlFor="employmentType">Employment Type <span className="text-red-500">*</span></Label>
              <Select name="employmentType" required>
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
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" name="salary" type="number" placeholder="Salary" />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select name="currency">
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
              <Label htmlFor="employmentStatus">Employment Status <span className="text-red-500">*</span></Label>
              <Select name="employmentStatus" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Employment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="TERMINATED">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="isProbation">Is on Probation?</Label>
              <Select name="isProbation">
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="probationEndDate">Probation End Date</Label>
              <Input id="probationEndDate" name="probationEndDate" type="date" />
            </div>

            <div>
              <Label htmlFor="contractEndDate">Contract End Date</Label>
              <Input id="contractEndDate" name="contractEndDate" type="date" />
            </div>
            <div>
  <Label htmlFor="profileImage">Profile Image</Label>
  <Input id="profileImage" name="profileImage" type="file" accept="image/*" />
</div>

<div>
  <Label htmlFor="resumeLink">Resume Link</Label>
  <Input id="resumeLink" name="resumeLink" placeholder="Resume Link" />
</div>

<div>
  <Label htmlFor="contractLink">Contract Link</Label>
  <Input id="contractLink" name="contractLink" placeholder="Contract Link" />
</div>

<div>
  <Label htmlFor="identityDocumentLink">Identity Document Link</Label>
  <Input id="identityDocumentLink" name="identityDocumentLink" placeholder="Identity Document Link" />
</div>

            <div>
              <Label htmlFor="emergencyContactName">Emergency Contact Name <span className="text-red-500">*</span></Label>
              <Input id="emergencyContactName" name="emergencyContactName" placeholder="Emergency Contact Name" required />
            </div>

            <div>
              <Label htmlFor="emergencyContactPhone">Emergency Contact Phone <span className="text-red-500">*</span></Label>
              <Input id="emergencyContactPhone" name="emergencyContactPhone" placeholder="Emergency Contact Phone" required />
            </div>

            <div>
              <Label htmlFor="emergencyContactRelationship">Emergency Contact Relationship <span className="text-red-500">*</span></Label>
              <Input id="emergencyContactRelationship" name="emergencyContactRelationship" placeholder="Emergency Contact Relationship" required />
            </div>

            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" name="bankName" placeholder="Bank Name" />
            </div>

            <div>
              <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
              <Input id="bankAccountNumber" name="bankAccountNumber" placeholder="Bank Account Number" />
            </div>

            <div>
              <Label htmlFor="bankBranch">Bank Branch</Label>
              <Input id="bankBranch" name="bankBranch" placeholder="Bank Branch" />
            </div>

            <div>
              <Label htmlFor="taxID">Tax ID</Label>
              <Input id="taxID" name="taxID" placeholder="Tax ID" />
            </div>

            <div>
              <Label htmlFor="socialSecurityNumber">Social Security Number</Label>
              <Input id="socialSecurityNumber" name="socialSecurityNumber" placeholder="Social Security Number" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Employee"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
}
