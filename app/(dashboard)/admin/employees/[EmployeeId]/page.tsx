"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Updated hook import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
  isActive: boolean;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  nationalID: string;
  departmentId: string;
  position: string;
  dateOfJoining: string;
  employmentType: string;
  maritalStatus: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  salary?: number;
  currency?: string;
  employmentStatus: string;
  isProbation?: boolean;
  probationEndDate?: string;
  contractEndDate?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankBranch?: string;
  taxID?: string;
  socialSecurityNumber?: string;
  profileImage?: string;
  resumeLink?: string;
  contractLink?: string;
  identityDocumentLink?: string;
}

export default function EditEmployeeForm() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const { employeeId } = useParams(); // Updated to useParams for dynamic routes

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
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

    async function fetchEmployee() {
      if (!employeeId) return; // Prevent fetching if ID is not available

      try {
        const res = await fetch(`/api/employees/${employeeId}`);
        const data = await res.json();
        setEmployee(data);
      } catch (error) {
        toast({
          title: "Error fetching employee data",
          description: "Could not load employee data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDepartments();
    fetchEmployee();
  }, [employeeId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target as HTMLFormElement);

    const updatedEmployee = {
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
      isProbation: formData.get("isProbation") === "on", // Handle checkbox
      probationEndDate: formData.get("probationEndDate"),
      contractEndDate: formData.get("contractEndDate"),
      bankName: formData.get("bankName"),
      bankAccountNumber: formData.get("bankAccountNumber"),
      bankBranch: formData.get("bankBranch"),
      taxID: formData.get("taxID"),
      socialSecurityNumber: formData.get("socialSecurityNumber"),
      profileImage: formData.get("profileImage"),
      resumeLink: formData.get("resumeLink"),
      contractLink: formData.get("contractLink"),
      identityDocumentLink: formData.get("identityDocumentLink"),
    };

    try {
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: "PUT",
        body: JSON.stringify(updatedEmployee),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        toast({
          title: "Success",
          description: "Employee updated successfully.",
          variant: "default",
        });
        router.push('/employees'); // Redirect after success
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update employee.",
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

  if (loading || !employee) return <div>Loading...</div>; // Ensure employee data is available before rendering form

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
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" name="middleName" defaultValue={employee.middleName} />
            </div>
            <div>
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input id="email" name="email" type="email" defaultValue={employee.email} required />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
              <Input id="phoneNumber" name="phoneNumber" defaultValue={employee.phoneNumber} required />
            </div>
            <div>
              <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
              <Select name="gender" defaultValue={employee.gender} required>
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
              <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={employee.dateOfBirth} required />
            </div>
            <div>
              <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
              <Textarea id="address" name="address" defaultValue={employee.address} required />
            </div>
            <div>
              <Label htmlFor="nationalID">National ID <span className="text-red-500">*</span></Label>
              <Input id="nationalID" name="nationalID" defaultValue={employee.nationalID} required />
            </div>
          </div>
        </div>

        {/* Job Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Job Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
              <Select name="department" defaultValue={employee.departmentId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="position">Position <span className="text-red-500">*</span></Label>
              <Input id="position" name="position" defaultValue={employee.position} required />
            </div>
            <div>
              <Label htmlFor="dateOfJoining">Date of Joining <span className="text-red-500">*</span></Label>
              <Input id="dateOfJoining" name="dateOfJoining" type="date" defaultValue={employee.dateOfJoining} required />
            </div>
            <div>
              <Label htmlFor="employmentType">Employment Type <span className="text-red-500">*</span></Label>
              <Select name="employmentType" defaultValue={employee.employmentType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-Time</SelectItem>
                  <SelectItem value="part-time">Part-Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="maritalStatus">Marital Status <span className="text-red-500">*</span></Label>
              <Select name="maritalStatus" defaultValue={employee.maritalStatus} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="emergencyContactName">Emergency Contact Name <span className="text-red-500">*</span></Label>
              <Input id="emergencyContactName" name="emergencyContactName" defaultValue={employee.emergencyContactName} required />
            </div>
            <div>
              <Label htmlFor="emergencyContactPhone">Emergency Contact Phone <span className="text-red-500">*</span></Label>
              <Input id="emergencyContactPhone" name="emergencyContactPhone" defaultValue={employee.emergencyContactPhone} required />
            </div>
            <div>
              <Label htmlFor="emergencyContactRelationship">Emergency Contact Relationship <span className="text-red-500">*</span></Label>
              <Input id="emergencyContactRelationship" name="emergencyContactRelationship" defaultValue={employee.emergencyContactRelationship} required />
            </div>
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" name="salary" type="number" defaultValue={employee.salary} />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" name="currency" defaultValue={employee.currency} />
            </div>
            <div>
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select name="employmentStatus" defaultValue={employee.employmentStatus} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Employment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="isProbation">Is on Probation?</Label>
              <Input id="isProbation" name="isProbation" type="checkbox" defaultChecked={employee.isProbation} />
            </div>
            <div>
              <Label htmlFor="probationEndDate">Probation End Date</Label>
              <Input id="probationEndDate" name="probationEndDate" type="date" defaultValue={employee.probationEndDate} />
            </div>
            <div>
              <Label htmlFor="contractEndDate">Contract End Date</Label>
              <Input id="contractEndDate" name="contractEndDate" type="date" defaultValue={employee.contractEndDate} />
            </div>
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" name="bankName" defaultValue={employee.bankName} />
            </div>
            <div>
              <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
              <Input id="bankAccountNumber" name="bankAccountNumber" defaultValue={employee.bankAccountNumber} />
            </div>
            <div>
              <Label htmlFor="bankBranch">Bank Branch</Label>
              <Input id="bankBranch" name="bankBranch" defaultValue={employee.bankBranch} />
            </div>
            <div>
              <Label htmlFor="taxID">Tax ID</Label>
              <Input id="taxID" name="taxID" defaultValue={employee.taxID} />
            </div>
            <div>
              <Label htmlFor="socialSecurityNumber">Social Security Number</Label>
              <Input id="socialSecurityNumber" name="socialSecurityNumber" defaultValue={employee.socialSecurityNumber} />
            </div>
            <div>
              <Label htmlFor="profileImage">Profile Image URL</Label>
              <Input id="profileImage" name="profileImage" defaultValue={employee.profileImage} />
            </div>
            <div>
              <Label htmlFor="resumeLink">Resume Link</Label>
              <Input id="resumeLink" name="resumeLink" defaultValue={employee.resumeLink} />
            </div>
            <div>
              <Label htmlFor="contractLink">Contract Link</Label>
              <Input id="contractLink" name="contractLink" defaultValue={employee.contractLink} />
            </div>
            <div>
              <Label htmlFor="identityDocumentLink">Identity Document Link</Label>
              <Input id="identityDocumentLink" name="identityDocumentLink" defaultValue={employee.identityDocumentLink} />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Employee"}
        </Button>
      </form>
    </ScrollArea>
  );
}
