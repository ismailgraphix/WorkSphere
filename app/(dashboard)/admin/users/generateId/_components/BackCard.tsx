import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface Employee {
  address: string;
  email: string;
  phoneNumber: string;
  dateOfJoining: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

interface BackCardProps {
  employee: Employee;
}

export function BackCard({ employee }: BackCardProps) {
  return (
    <Card id="back-card" className="w-[340px] h-[540px] relative overflow-hidden">
      <CardContent className="p-0 h-full bg-white">
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[120px] border-l-[120px] border-orange-400 border-r-transparent border-b-transparent" />
        <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[120px] border-r-[120px] border-orange-400 border-l-transparent border-t-transparent" />
        <div className="relative z-10 p-6">
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-gray-600">Address:</p>
              <p className="text-gray-900 text-xs">{employee.address}</p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="text-gray-900 text-xs">{employee.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone:</p>
              <p className="text-gray-900 text-xs">{employee.phoneNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Start Date:</p>
              <p className="text-gray-900 text-xs">{new Date(employee.dateOfJoining).toLocaleDateString()}</p>
            </div>
            <div className="pt-4">
              <p className="font-semibold text-gray-900">Emergency Contact:</p>
              <div className="mt-2 space-y-1 text-xs">
                <p className="text-gray-900">Name: {employee.emergencyContactName}</p>
                <p className="text-gray-900">Phone: {employee.emergencyContactPhone}</p>
                <p className="text-gray-900">Relationship: {employee.emergencyContactRelationship}</p>
              </div>
            </div>
            <div className="pt-4">
              <p className="font-semibold text-gray-900">Terms and Conditions</p>
              <p className="text-xs text-gray-600 mt-1">
                This identification card (ID) certifies that the bearer is an
                employee of the company. ID should not be used for official
                identification outside the company.
              </p>
            </div>
            <div className="pt-4 flex justify-between">
              <div className="text-center">
                <div className="w-24 border-b border-gray-400" />
                <p className="text-[10px] text-gray-600 mt-1">Employee&apos;s Signature</p>
              </div>
              <div className="text-center">
                <div className="w-24 border-b border-gray-400" />
                <p className="text-[10px] text-gray-600 mt-1">Company CEO</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}