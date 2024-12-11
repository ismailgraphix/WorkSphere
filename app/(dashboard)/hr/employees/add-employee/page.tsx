"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "../../../../../hooks/use-toast";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, Calendar as CalendarIcon } from 'lucide-react';
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface Department {
  id: string;
  name: string;
  isActive: boolean;
}

export default function EmployeeRegistrationForm() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: null as Date | null,
    address: '',
    nationalID: '',
    maritalStatus: '',
    departmentId: '',
    position: '',
    dateOfJoining: null as Date | null,
    employmentType: '',
    employmentStatus: 'ACTIVE',
    salary: '',
    currency: '',
    isProbation: 'false',
    probationEndDate: null as Date | null,
    contractEndDate: null as Date | null,
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    bankName: '',
    bankAccountNumber: '',
    bankBranch: '',
    taxID: '',
    socialSecurityNumber: '',
    profileImage: '',
    resumeLink: '',
    contractLink: '',
    identityDocumentLink: '',
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        const activeDepartments = data.filter((dept: Department) => dept.isActive);
        setDepartments(activeDepartments);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast({
          title: "Error fetching departments",
          description: "Could not load departments. Please try again.",
          variant: "destructive",
        });
      }
    }

    fetchDepartments();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployeeData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setEmployeeData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string) => (date: Date | undefined) => {
    setEmployeeData(prev => ({ ...prev, [name]: date || null }));
  };

  const handleFileUpload = (field: string) => async (url: string) => {
    setEmployeeData(prev => ({ ...prev, [field]: url }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const formattedData = {
      ...employeeData,
      dateOfBirth: employeeData.dateOfBirth ? format(employeeData.dateOfBirth, 'yyyy-MM-dd') : null,
      dateOfJoining: employeeData.dateOfJoining ? format(employeeData.dateOfJoining, 'yyyy-MM-dd') : null,
      probationEndDate: employeeData.probationEndDate ? format(employeeData.probationEndDate, 'yyyy-MM-dd') : null,
      contractEndDate: employeeData.contractEndDate ? format(employeeData.contractEndDate, 'yyyy-MM-dd') : null,
    };

    console.log('Employee Form Data:', formattedData);

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to register employee');
      }


      toast({
        title: "Success",
        description: "Employee registered successfully.",
        variant: "default",
      });
      router.push('/hr/employees');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while submitting the form.",
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
              <Input id="firstName" name="firstName" value={employeeData.firstName} onChange={handleInputChange} required />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
              <Input id="lastName" name="lastName" value={employeeData.lastName} onChange={handleInputChange} required />
            </div>

            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" name="middleName" value={employeeData.middleName} onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input id="email" name="email" type="email" value={employeeData.email} onChange={handleInputChange} required />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
              <Input id="phoneNumber" name="phoneNumber" value={employeeData.phoneNumber} onChange={handleInputChange} required />
            </div>

            <div>
              <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
              <Select name="gender" value={employeeData.gender} onValueChange={handleSelectChange("gender")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!employeeData.dateOfBirth && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {employeeData.dateOfBirth ? format(employeeData.dateOfBirth, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={employeeData.dateOfBirth || undefined}
                    onSelect={handleDateChange("dateOfBirth")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
              <Textarea id="address" name="address" value={employeeData.address} onChange={handleInputChange} required />
            </div>

            <div>
              <Label htmlFor="nationalID">National ID <span className="text-red-500">*</span></Label>
              <Input id="nationalID" name="nationalID" value={employeeData.nationalID} onChange={handleInputChange} required />
            </div>

            <div>
              <Label htmlFor="maritalStatus">Marital Status <span className="text-red-500">*</span></Label>
              <Select name="maritalStatus" value={employeeData.maritalStatus} onValueChange={handleSelectChange("maritalStatus")}>
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

            <div className="md:col-span-2">
              <Label htmlFor="profileImage">Profile Image</Label>
              <Card className="mt-2">
                <CardContent className="flex items-center space-x-4 p-4">
                  {employeeData.profileImage ? (
                    <Image 
                      src={employeeData.profileImage} 
                      alt="Profile" 
                      width={100}
                      height={100}
                      className="rounded-full object-cover" 
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <FileUpload
                      onUpload={handleFileUpload('profileImage')}
                      label="Upload Profile Image"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Employment Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Employment Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
              <Select 
                name="departmentId" 
                value={employeeData.departmentId} 
                onValueChange={handleSelectChange("departmentId")}
                required
              >
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
              <Input id="position" name="position" value={employeeData.position} onChange={handleInputChange} required />
            </div>

            <div>
              <Label htmlFor="dateOfJoining">Date of Joining <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!employeeData.dateOfJoining && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {employeeData.dateOfJoining ? format(employeeData.dateOfJoining, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={employeeData.dateOfJoining || undefined}
                    onSelect={handleDateChange("dateOfJoining")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="employmentType">Employment Type <span className="text-red-500">*</span></Label>
              <Select name="employmentType" value={employeeData.employmentType} onValueChange={handleSelectChange("employmentType")}>
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
              <Input id="salary" name="salary" type="number" value={employeeData.salary} onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select name="currency" value={employeeData.currency} onValueChange={handleSelectChange("currency")}>
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
              <Select name="employmentStatus" value={employeeData.employmentStatus} onValueChange={handleSelectChange("employmentStatus")}>
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
              <Select name="isProbation" value={employeeData.isProbation} onValueChange={handleSelectChange("isProbation")}>
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!employeeData.probationEndDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {employeeData.probationEndDate ? format(employeeData.probationEndDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={employeeData.probationEndDate || undefined}
                    onSelect={handleDateChange("probationEndDate")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="contractEndDate">Contract End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!employeeData.contractEndDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {employeeData.contractEndDate ? format(employeeData.contractEndDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={employeeData.contractEndDate || undefined}
                    onSelect={handleDateChange("contractEndDate")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

{/* Document Upload Section */}
<div className="md:col-span-2 space-y-4">
  <h4 className="text-md font-medium">Documents</h4>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {['resumeLink', 'contractLink', 'identityDocumentLink'].map((docType) => (
      <Card key={docType}>
        <CardContent className="p-4">
          <Label htmlFor={docType} className="font-medium mb-2 block">
            {docType === 'resumeLink' ? 'Resume' : 
             docType === 'contractLink' ? 'Contract' : 'Identity Document'}
          </Label>
          {employeeData[docType as keyof typeof employeeData] ? (
            <div className="flex items-center space-x-2">
              <File className="h-6 w-6 text-blue-500" />
              <a
  href={
    employeeData[docType as keyof typeof employeeData] 
      ? String(employeeData[docType as keyof typeof employeeData]) 
      : undefined // Use undefined if the value is null or falsy
  }
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-500 hover:underline text-sm"
>
  View Document
</a>
            </div>
          ) : (
            <FileUpload
              onUpload={handleFileUpload(docType)}
              label={`Upload ${docType === 'resumeLink' ? 'Resume' : 
                          docType === 'contractLink' ? 'Contract' : 'Identity Document'}`}
            />
          )}
        </CardContent>
      </Card>
    ))}
  </div>
</div>



            <div>
              <Label htmlFor="emergencyContactName">Emergency Contact Name <span className="text-red-500">*</span></Label>
              <Input id="emergencyContactName" name="emergencyContactName" value={employeeData.emergencyContactName} onChange={handleInputChange} required />
            </div>

            <div>
              <Label htmlFor="emergencyContactPhone">Emergency Contact Phone <span className="text-red-500">*</span></Label>
              <Input id="emergencyContactPhone" name="emergencyContactPhone" value={employeeData.emergencyContactPhone} onChange={handleInputChange} required />
            </div>

            <div>
              <Label htmlFor="emergencyContactRelationship">Emergency Contact Relationship <span className="text-red-500">*</span></Label>
              <Input id="emergencyContactRelationship" name="emergencyContactRelationship" value={employeeData.emergencyContactRelationship} onChange={handleInputChange} required />
            </div>

            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" name="bankName" value={employeeData.bankName} onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
              <Input id="bankAccountNumber" name="bankAccountNumber" value={employeeData.bankAccountNumber} onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="bankBranch">Bank Branch</Label>
              <Input id="bankBranch" name="bankBranch" value={employeeData.bankBranch} onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="taxID">Tax ID</Label>
              <Input id="taxID" name="taxID" value={employeeData.taxID} onChange={handleInputChange} />
            </div>

            <div>
              <Label htmlFor="socialSecurityNumber">Social Security Number</Label>
              <Input id="socialSecurityNumber" name="socialSecurityNumber" value={employeeData.socialSecurityNumber} onChange={handleInputChange} />
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