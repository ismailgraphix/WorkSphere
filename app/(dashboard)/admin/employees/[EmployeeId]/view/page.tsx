'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "../../../../../../hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Loader2, User, Briefcase, Phone, Mail, MapPin, CreditCard, Calendar, FileText, Link } from 'lucide-react'

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
  maritalStatus: string
  department: { name: string }
  position: string
  dateOfJoining: string
  employmentType: string
  employmentStatus: string
  salary?: number
  currency?: string
  isProbation: boolean
  probationEndDate?: string
  contractEndDate?: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  bankName: string
  bankAccountNumber: string
  bankBranch: string
  taxID: string
  socialSecurityNumber: string
  profileImage: string
  resumeLink: string
  contractLink: string
  identityDocumentLink: string
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
        console.error("Error occurred", error)
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

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }
  if (!employee) return <div className="flex justify-center items-center h-screen">Employee not found</div>

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full p-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={employee.profileImage} alt={`${employee.firstName} ${employee.lastName}`} />
              <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{`${employee.firstName} ${employee.middleName || ''} ${employee.lastName}`}</h1>
              <p className="text-muted-foreground">{employee.position}</p>
              <Badge className="mt-1" variant={employee.employmentStatus === 'ACTIVE' ? 'default' : 'destructive'}>
                {employee.employmentStatus}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={User} label="Employee ID" value={employee.employeeId} />
                <InfoItem icon={Mail} label="Email" value={employee.email} />
                <InfoItem icon={Phone} label="Phone" value={employee.phoneNumber} />
                <InfoItem icon={User} label="Gender" value={employee.gender} />
                <InfoItem icon={Calendar} label="Date of Birth" value={new Date(employee.dateOfBirth).toLocaleDateString()} />
                <InfoItem icon={MapPin} label="Address" value={employee.address} />
                <InfoItem icon={FileText} label="National ID" value={employee.nationalID} />
                <InfoItem icon={User} label="Marital Status" value={employee.maritalStatus} />
              </div>
              <Separator className="my-4" />
              <h3 className="text-lg font-semibold mb-2">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={User} label="Name" value={employee.emergencyContactName} />
                <InfoItem icon={Phone} label="Phone" value={employee.emergencyContactPhone} />
                <InfoItem icon={User} label="Relationship" value={employee.emergencyContactRelationship} />
              </div>
            </TabsContent>
            <TabsContent value="employment">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={Briefcase} label="Department" value={employee.department.name} />
                <InfoItem icon={Briefcase} label="Position" value={employee.position} />
                <InfoItem icon={Calendar} label="Date of Joining" value={new Date(employee.dateOfJoining).toLocaleDateString()} />
                <InfoItem icon={Briefcase} label="Employment Type" value={employee.employmentType} />
                <InfoItem icon={Briefcase} label="Probation" value={employee.isProbation ? 'Yes' : 'No'} />
                {employee.isProbation && employee.probationEndDate && (
                  <InfoItem icon={Calendar} label="Probation End Date" value={new Date(employee.probationEndDate).toLocaleDateString()} />
                )}
                {employee.contractEndDate && (
                  <InfoItem icon={Calendar} label="Contract End Date" value={new Date(employee.contractEndDate).toLocaleDateString()} />
                )}
              </div>
            </TabsContent>
            <TabsContent value="financial">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={CreditCard} label="Salary" value={employee.salary ? `${employee.salary} ${employee.currency}` : 'N/A'} />
                <InfoItem icon={CreditCard} label="Bank Name" value={employee.bankName} />
                <InfoItem icon={CreditCard} label="Bank Account" value={employee.bankAccountNumber} />
                <InfoItem icon={CreditCard} label="Bank Branch" value={employee.bankBranch} />
                <InfoItem icon={FileText} label="Tax ID" value={employee.taxID} />
                <InfoItem icon={FileText} label="Social Security Number" value={employee.socialSecurityNumber} />
              </div>
            </TabsContent>
            <TabsContent value="documents">
              <div className="grid grid-cols-2 gap-4">
                <DocumentLink label="Resume" href={employee.resumeLink} />
                <DocumentLink label="Contract" href={employee.contractLink} />
                <DocumentLink label="Identity Document" href={employee.identityDocumentLink} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ScrollArea>
  )
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  )
}

function DocumentLink({ label, href }: { label: string, href: string }) {
  return (
    <Button variant="outline" className="w-full justify-start" asChild>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Link className="mr-2 h-4 w-4" />
        {label}
      </a>
    </Button>
  )
}