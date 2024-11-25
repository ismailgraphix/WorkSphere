'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/file-upload"
import Image from "next/image"
import { EmploymentType, MaritalStatus, Currency, EmploymentStatus } from '@prisma/client'
import { Loader2, Upload, File, X, Calendar as CalendarIcon } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parse, isValid } from "date-fns"

interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  middleName?: string 
  email: string
  phoneNumber: string
  gender: string
  dateOfBirth: string | null
  address: string
  nationalID: string
  position: string
  department: { id: string; name: string }
  dateOfJoining: string | null
  employmentType: string
  employmentStatus: "ACTIVE" | "SUSPENDED" | "TERMINATED"
  maritalStatus: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  salary?: number
  currency?: string
  isProbation: boolean
  probationEndDate?: string | null
  contractEndDate?: string | null
  bankName?: string
  bankAccountNumber?: string
  bankBranch?: string
  taxID?: string
  socialSecurityNumber?: string
  profileImage?: string
  resumeLink?: string
  contractLink?: string
  identityDocumentLink?: string
}

interface Department {
  id: string
  name: string
  isActive: boolean
}

// Helper function to safely parse dates
const safeParseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  const parsedDate = new Date(dateString);
  return isValid(parsedDate) ? parsedDate : null;
};

export default function EditEmployeeForm() {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  
  const employeeId = params.employeeId as string
  
  useEffect(() => {
    async function fetchEmployeeAndDepartments() {
      try {
        if (!employeeId) {
          toast({
            title: "Error",
            description: "Employee ID is missing",
            variant: "destructive",
          })
          router.push('/admin/employees')
          return
        }

        const [employeeRes, departmentsRes] = await Promise.all([
          fetch(`/api/employees/${employeeId}`),
          fetch("/api/departments")
        ])
        
        if (!employeeRes.ok) throw new Error("Failed to fetch employee")
        if (!departmentsRes.ok) throw new Error("Failed to fetch departments")

        const employeeData = await employeeRes.json()
        const departmentsData = await departmentsRes.json()

        setEmployee(employeeData)
        setDepartments(departmentsData.filter((dept: Department) => dept.isActive))
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load employee data. Please try again.",
          variant: "destructive",
        })
        router.push('/admin/employees')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeAndDepartments()
  }, [employeeId, toast, router])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    
    try {
      const formElement = event.target as HTMLFormElement
      const formData = new FormData(formElement)
      
      const employeeData = {
        ...Object.fromEntries(formData),
        profileImage: employee?.profileImage,
        resumeLink: employee?.resumeLink,
        contractLink: employee?.contractLink,
        identityDocumentLink: employee?.identityDocumentLink,
        isProbation: formData.get('isProbation') === 'true',
        salary: formData.get('salary') ? parseFloat(formData.get('salary') as string) : null,
        employmentType: formData.get('employmentType') as EmploymentType,
        maritalStatus: formData.get('maritalStatus') as MaritalStatus,
        currency: formData.get('currency') as Currency || null,
        employmentStatus: formData.get('employmentStatus') as EmploymentStatus,
        dateOfBirth: employee?.dateOfBirth,
        dateOfJoining: employee?.dateOfJoining,
        probationEndDate: employee?.probationEndDate,
        contractEndDate: employee?.contractEndDate,
      }

      const res = await fetch(`/api/employees/${employeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update employee")
      }

      toast({
        title: "Success",
        description: "Employee updated successfully.",
        variant: "default",
      })
      router.push('/admin/employees')
    } catch (error) {
      console.error('Update error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while updating the employee.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (field: keyof Employee) => async (url: string) => {
    try {
      setEmployee(prev => {
        if (!prev) return null
        return { ...prev, [field]: url }
      })

      const res = await fetch(`/api/employees/${employeeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [field]: url
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update file URL')
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
        variant: "default",
      })
    } catch (error) {
      console.error('File upload error:', error)
      toast({
        title: "Error",
        description: "Failed to save file upload. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDateChange = (field: keyof Employee) => (date: Date | undefined) => {
    setEmployee(prev => {
      if (!prev) return null
      return { ...prev, [field]: date ? format(date, 'yyyy-MM-dd') : null }
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }
  if (!employee) return <div>Employee not found</div>

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
              <Select name="gender" defaultValue={employee.gender}>
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
                    className={`w-full justify-start text-left font-normal ${!employee.dateOfBirth && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {employee.dateOfBirth ? format(safeParseDate(employee.dateOfBirth) || new Date(), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={safeParseDate(employee.dateOfBirth) || undefined}
                    onSelect={handleDateChange('dateOfBirth')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
              <Textarea id="address" name="address" defaultValue={employee.address} required />
            </div>
            <div>
              <Label htmlFor="nationalID">National ID <span className="text-red-500">*</span></Label>
              <Input id="nationalID" name="nationalID" defaultValue={employee.nationalID} required />
            </div>
            <div>
              <Label htmlFor="maritalStatus">Marital Status <span className="text-red-500">*</span></Label>
              <Select name="maritalStatus" defaultValue={employee.maritalStatus}>
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
                  {employee?.profileImage ? (
                    <Image 
                      src={employee.profileImage} 
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
              <Label htmlFor="position">Position</Label>
              <Input id="position" name="position" defaultValue={employee.position} required />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select name="departmentId" defaultValue={employee.department.id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateOfJoining">Date of Joining</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!employee.dateOfJoining && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {employee.dateOfJoining ? format(safeParseDate(employee.dateOfJoining) || new Date(), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={safeParseDate(employee.dateOfJoining) || undefined}
                    onSelect={handleDateChange('dateOfJoining')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select name="employmentType" defaultValue={employee.employmentType}>
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
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select name="employmentStatus" defaultValue={employee.employmentStatus}>
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
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" name="salary" type="number" defaultValue={employee.salary?.toString()} />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select name="currency" defaultValue={employee.currency}>
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
              <Label htmlFor="isProbation">Is on Probation</Label>
              <Select name="isProbation" defaultValue={employee.isProbation.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Probation Status" />
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
                    className={`w-full justify-start text-left font-normal ${!employee.probationEndDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {employee.probationEndDate ? format(safeParseDate(employee.probationEndDate) || new Date(), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={safeParseDate(employee.probationEndDate) || undefined}
                    onSelect={handleDateChange('probationEndDate')}
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
                    className={`w-full justify-start text-left font-normal ${!employee.contractEndDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {employee.contractEndDate ? format(safeParseDate(employee.contractEndDate) || new Date(), 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={safeParseDate(employee.contractEndDate) || undefined}
                    onSelect={handleDateChange('contractEndDate')}
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
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor={docType} className="font-medium">
                          {docType === 'resumeLink' ? 'Resume' : 
                           docType === 'contractLink' ? 'Contract' : 'Identity Document'}
                        </Label>
                        {employee[docType as keyof Employee] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEmployee(prev => prev ? {...prev, [docType]: null} : null)
                              // You might want to add an API call here to remove the document from the server
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {employee[docType as keyof Employee] ? (
                        <div className="flex items-center space-x-2">
                          <File className="h-6 w-6 text-blue-500" />
                          <a 
                            href={employee[docType as keyof Employee] as string} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-500 hover:underline text-sm"
                          >
                            View Document
                          </a>
                        </div>
                      ) : (
                        <FileUpload
                          onUpload={handleFileUpload(docType as keyof Employee)}
                          label={`Upload ${docType === 'resumeLink' ? 'Resume' : 
                                          docType === 'contractLink' ? 'Contract' : 'Identity Document'}`}
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Emergency Contact Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
              <Input id="emergencyContactName" name="emergencyContactName" defaultValue={employee.emergencyContactName} required />
            </div>
            <div>
              <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
              <Input id="emergencyContactPhone" name="emergencyContactPhone" defaultValue={employee.emergencyContactPhone} required />
            </div>
            <div>
              <Label htmlFor="emergencyContactRelationship">Emergency Contact Relationship</Label>
              <Input id="emergencyContactRelationship" name="emergencyContactRelationship" defaultValue={employee.emergencyContactRelationship} required />
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Bank Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taxID">Tax ID</Label>
              <Input id="taxID" name="taxID" defaultValue={employee.taxID} />
            </div>
            <div>
              <Label htmlFor="socialSecurityNumber">Social Security Number</Label>
              <Input id="socialSecurityNumber" name="socialSecurityNumber" defaultValue={employee.socialSecurityNumber} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Employee"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  )
}