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
import { FileUpload } from "../../../../../components/file-upload"
import Image from "next/image"

interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  gender: string
  dateOfBirth: string
  address: string
  nationalID: string
  position: string
  department: { id: string; name: string }
  dateOfJoining: string
  employmentType: string
  employmentStatus: "ACTIVE" | "SUSPENDED" | "TERMINATED"
  maritalStatus: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  salary?: number
  currency?: string
  isProbation: boolean
  probationEndDate?: string
  contractEndDate?: string
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
}

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
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeAndDepartments()
  }, [employeeId, toast])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.target as HTMLFormElement)

    // Convert FormData to a plain object
    const employeeData = Object.fromEntries(formData)

    // Add file URLs to the employeeData
    if (employee) {
      employeeData.profileImage = employee.profileImage
      employeeData.resumeLink = employee.resumeLink
      employeeData.contractLink = employee.contractLink
      employeeData.identityDocumentLink = employee.identityDocumentLink
    }

    try {
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: "PUT",
        body: JSON.stringify(employeeData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Employee updated successfully.",
          variant: "default",
        })
        router.push('/admin/employees')
      } else {
        const error = await res.json()
        throw new Error(error.message || "Failed to update employee")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while updating the employee.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (field: keyof Employee) => (url: string) => {
    setEmployee(prev => prev ? { ...prev, [field]: url } : null)
  }

  if (loading) return <div>Loading...</div>
  if (!employee) return <div>Employee not found</div>

  return (
    <ScrollArea className="h-[80vh] w-full p-4">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" defaultValue={employee.firstName} required />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" defaultValue={employee.lastName} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={employee.email} required />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" defaultValue={employee.phoneNumber} required />
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
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
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={employee.dateOfBirth} required />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" defaultValue={employee.address} required />
            </div>
            <div>
              <Label htmlFor="nationalID">National ID</Label>
              <Input id="nationalID" name="nationalID" defaultValue={employee.nationalID} required />
            </div>
            <div>
              <Label htmlFor="maritalStatus">Marital Status</Label>
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
            <div>
              <Label htmlFor="profileImage">Profile Image</Label>
              <FileUpload
                onUpload={handleFileUpload('profileImage')}
                label="Upload Profile Image"
              />
              {employee.profileImage && (
                <Image src={employee.profileImage} alt="Profile" className="mt-2 w-32 h-32 object-cover rounded-full" />
              )}
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
              <Input id="dateOfJoining" name="dateOfJoining" type="date" defaultValue={employee.dateOfJoining} required />
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
              <Input id="probationEndDate" name="probationEndDate" type="date" defaultValue={employee.probationEndDate} />
            </div>
            <div>
              <Label htmlFor="contractEndDate">Contract End Date</Label>
              <Input id="contractEndDate" name="contractEndDate" type="date" defaultValue={employee.contractEndDate} />
            </div>
            <div>
              <Label htmlFor="resumeLink">Resume</Label>
              <FileUpload
                onUpload={handleFileUpload('resumeLink')}
                label="Upload Resume"
              />
              {employee.resumeLink && (
                <a href={employee.resumeLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Resume
                </a>
              )}
            </div>
            <div>
              <Label htmlFor="contractLink">Contract</Label>
              <FileUpload
                onUpload={handleFileUpload('contractLink')}
                label="Upload Contract"
              />
              {employee.contractLink && (
                <a href={employee.contractLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Contract
                </a>
              )}
            </div>
            <div>
              <Label htmlFor="identityDocumentLink">Identity Document</Label>
              <FileUpload
                onUpload={handleFileUpload('identityDocumentLink')}
                label="Upload Identity Document"
              />
              {employee.identityDocumentLink && (
                <a href={employee.identityDocumentLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Identity Document
                </a>
              )}
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