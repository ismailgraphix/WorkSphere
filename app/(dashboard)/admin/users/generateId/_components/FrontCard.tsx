import React from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from 'qrcode.react';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  employeeId: string;
  profileImage?: string;
  department: {
    name: string;
  };
}

interface FrontCardProps {
  employee: Employee;
}

export function FrontCard({ employee }: FrontCardProps) {
  return (
    <Card id="front-card" className="w-[340px] h-[540px] relative overflow-hidden">
      <CardContent className="p-0 h-full bg-white">
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[120px] border-l-[120px] border-orange-400 border-r-transparent border-b-transparent" />
        <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[120px] border-r-[120px] border-orange-400 border-l-transparent border-t-transparent" />
        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between">
            <Image
              src="/company-logo.png"
              alt="Company Logo"
              width={100}
              height={40}
              className="mb-6"
            />
          </div>
          <div className="flex flex-col items-center mt-4">
            <Avatar className="h-32 w-32 mb-6 rounded-full border-2 border-white shadow-lg">
              <AvatarImage src={employee.profileImage || '/placeholder.svg?height=128&width=128'} />
              <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-center text-gray-900">
              {employee.lastName}, {employee.firstName}
            </h2>
            <p className="text-md mt-2 text-gray-600">{employee.position}</p>
            <p className="text-sm mt-1 text-gray-500">{employee.department.name}</p>
            <p className="text-sm mt-2 text-gray-500">ID Number: {employee.employeeId}</p>
            <div className="mt-6">
              <QRCodeSVG 
                value={JSON.stringify({
                  id: employee.id,
                  name: `${employee.firstName} ${employee.lastName}`,
                  employeeId: employee.employeeId
                })}
                size={100}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}