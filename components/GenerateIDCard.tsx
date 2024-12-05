'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { jsPDF } from "jspdf"
import Image from 'next/image'

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  position: string
  employeeId: string
  profileImage: string | null
  department: {
    name: string
  }
  bloodType?: string
  phoneNumber?: string
  dateOfJoining: Date
  dateOfExpiry: Date
  emergencyContactPhone?: string
}

interface EmployeeIDCardProps {
  employee: Employee
}

export default function EmployeeIDCard({ employee }: EmployeeIDCardProps) {
  const [showBack, setShowBack] = useState(false)
  
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [54, 85]
    })

    // Front side
    doc.setFillColor(26, 54, 93) // Navy blue
    doc.rect(0, 0, 54, 85, 'F')
    
    // Green and yellow curves
    doc.setFillColor(34, 197, 94) // Green
    doc.roundedRect(0, 10, 54, 40, 20, 20, 'F')
    doc.setFillColor(132, 204, 22) // Yellow
    doc.roundedRect(0, 5, 54, 40, 20, 20, 'F')

    doc.addImage('/logo.png', 'PNG', 2, 2, 15, 7)
    
    // Employee details
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(employee.firstName, 27, 55, { align: 'center' })
    doc.text(employee.lastName, 27, 60, { align: 'center' })
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(employee.position, 27, 65, { align: 'center' })
    doc.text(`ID: ${employee.employeeId}`, 27, 70, { align: 'center' })

    // QR Code
    const qrCodeDataUrl = document.getElementById('qr-code')?.querySelector('canvas')?.toDataURL()
    if (qrCodeDataUrl) {
      doc.addImage(qrCodeDataUrl, 'PNG', 17, 72, 20, 20)
    }

    // Back side
    doc.addPage([54, 85])
    doc.setFillColor(26, 54, 93) // Navy blue
    doc.rect(0, 0, 54, 85, 'F')
    
    // Green and yellow curves
    doc.setFillColor(34, 197, 94) // Green
    doc.roundedRect(0, 45, 54, 40, 20, 20, 'F')
    doc.setFillColor(132, 204, 22) // Yellow
    doc.roundedRect(0, 50, 54, 40, 20, 20, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text(`Code: ${employee.employeeId}`, 5, 15)
    doc.text(`Blood: ${employee.bloodType || 'Not specified'}`, 5, 22)
    doc.text(`Phone: ${employee.phoneNumber || 'Not specified'}`, 5, 29)
    doc.text(`ID: ${employee.employeeId}`, 5, 36)
    doc.text(`Join: ${new Date(employee.dateOfJoining).toLocaleDateString()}`, 5, 43)
    doc.text(`Expire: ${new Date(employee.dateOfExpiry).toLocaleDateString()}`, 5, 50)
    doc.text(`Emergency: ${employee.emergencyContactPhone || 'Not specified'}`, 5, 57)

    doc.addImage('/logo.png', 'PNG', 39, 75, 15, 7)

    doc.save(`${employee.firstName}_${employee.lastName}_ID_Card.pdf`)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Card 
          className={`w-[216px] h-[340px] transition-transform duration-1000 cursor-pointer preserve-3d ${
            showBack ? 'rotate-y-180' : ''
          }`}
          onClick={() => setShowBack(!showBack)}
        >
          {/* Front Side */}
          <div className="absolute inset-0 backface-hidden">
            <CardContent className="p-0 h-full relative bg-[#1a365d] text-white overflow-hidden">
              <div className="absolute top-10 -left-10 w-[150%] h-40 bg-[#22c55e] rounded-b-full transform -rotate-6" />
              <div className="absolute top-5 -left-10 w-[150%] h-40 bg-[#84cc16] rounded-b-full transform -rotate-6" />
              <div className="relative z-10 p-4">
                <Image src="/logo.png" alt="Company Logo" className="h-8 mb-4" />
                <div className="flex flex-col items-center mt-8">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-white">
                    <AvatarImage src={employee.profileImage || '/placeholder.svg?height=96&width=96'} />
                    <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-center">
                    {employee.firstName}<br/>{employee.lastName}
                  </h2>
                  <p className="text-sm">{employee.position}</p>
                  <p className="text-sm mt-2">ID: {employee.employeeId}</p>
                  <div className="mt-4" id="qr-code">
                    <QRCodeSVG 
                      value={JSON.stringify({
                        id: employee.id,
                        name: `${employee.firstName} ${employee.lastName}`,
                        employeeId: employee.employeeId
                      })}
                      size={80}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <CardContent className="p-4 h-full relative bg-[#1a365d] text-white overflow-hidden">
              <div className="absolute bottom-10 -left-10 w-[150%] h-40 bg-[#22c55e] rounded-t-full transform rotate-6" />
              <div className="absolute bottom-5 -left-10 w-[150%] h-40 bg-[#84cc16] rounded-t-full transform rotate-6" />
              <div className="relative z-10 space-y-2">
                <p>Code: {employee.employeeId}</p>
                <p>Blood: {employee.bloodType || 'Not specified'}</p>
                <p>Phone: {employee.phoneNumber || 'Not specified'}</p>
                <p>ID: {employee.employeeId}</p>
                <p>Join: {new Date(employee.dateOfJoining).toLocaleDateString()}</p>
                <p>Expire: {new Date(employee.dateOfExpiry).toLocaleDateString()}</p>
                <p>Emergency: {employee.emergencyContactPhone || 'Not specified'}</p>
              </div>
              <Image src="/logo.png" alt="Company Logo" className="absolute bottom-4 right-4 h-8" />
            </CardContent>
          </div>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground">Click the card to flip it</p>

      <Button onClick={generatePDF} className="mt-4">
        Download ID Card
      </Button>

      <style jsx global>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}