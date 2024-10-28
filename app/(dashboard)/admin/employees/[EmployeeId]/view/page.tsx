'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  middleName?: string
  email: string
  phoneNumber: string
  gender: string
  dateOfBirth: string
  address: string
  nationalID: string
  department: { name: string }
  position: string
  dateOfJoining: string
  employmentType: string
  maritalStatus: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  salary?: number
  currency?: string
  employmentStatus: string
  isProbation: boolean
  probationEndDate?: string
  contractEndDate?: string
}

export default function ViewEmployeePage() {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const params = useParams()
  const employeeId = params.employeeId as string

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const res = await fetch(`/api/employees/${employeeId}`)
        if (!res.ok) throw new Error("Failed to fetch employee")
        const data = await res.json()
        setEmployee(data)
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

    fetchEmployee()
  }, [employeeId, toast])

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (!employee) return <div className="flex justify-center items-center h-screen">Employee not found</div>

  return (
    <ScrollArea className="h-[80vh] w-full p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Employee Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Employee ID:</span> {employee.employeeId}</p>
                <p><span className="font-medium">Name:</span> {`${employee.firstName} ${employee.middleName || ''} ${employee.lastName}`}</p>
                <p><span className="font-medium">Email:</span> {employee.email}</p>
                <p><span className="font-medium">Phone:</span> {employee.phoneNumber}</p>
                <p><span className="font-medium">Gender:</span> {employee.gender}</p>
                <p><span className="font-medium">Date of Birth:</span> {new Date(employee.dateOfBirth).toLocaleDateString()}</p>
                <p><span className="font-medium">Address:</span> {employee.address}</p>
                <p><span className="font-medium">National ID:</span> {employee.nationalID}</p>
                <p><span className="font-medium">Marital Status:</span> {employee.maritalStatus}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Employment Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Department:</span> {employee.department.name}</p>
                <p><span className="font-medium">Position:</span> {employee.position}</p>
                <p><span className="font-medium">Date of Joining:</span> {new Date(employee.dateOfJoining).toLocaleDateString()}</p>
                <p><span className="font-medium">Employment Type:</span> {employee.employmentType}</p>
                <p><span className="font-medium">Employment Status:</span> 
                  <Badge className="ml-2" variant={employee.employmentStatus === 'ACTIVE' ? 'default' : 'destructive'}>
                    {employee.employmentStatus}
                  </Badge>
                </p>
                <p><span className="font-medium">Salary:</span> {employee.salary ? `${employee.salary} ${employee.currency}` : 'N/A'}</p>
                <p><span className="font-medium">Probation:</span> {employee.isProbation ? 'Yes' : 'No'}</p>
                {employee.isProbation && employee.probationEndDate && (
                  <p><span className="font-medium">Probation End Date:</span> {new Date(employee.probationEndDate).toLocaleDateString()}</p>
                )}
                {employee.contractEndDate && (
                  <p><span className="font-medium">Contract End Date:</span> {new Date(employee.contractEndDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Emergency Contact</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {employee.emergencyContactName}</p>
                <p><span className="font-medium">Phone:</span> {employee.emergencyContactPhone}</p>
                <p><span className="font-medium">Relationship:</span> {employee.emergencyContactRelationship}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  )
}