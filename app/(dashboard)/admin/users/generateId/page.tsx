"use client"

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Download, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FrontCard } from './_components/FrontCard';
import { BackCard } from './_components/BackCard';
import { generateIDCardPDF } from '../../../../../utils/pdf-generator';

export default function GenerateIdCardPage() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState('');
  const { toast } = useToast();

  const fetchEmployeeData = useCallback(async () => {
    if (!employeeId) {
      toast({
        title: "Error",
        description: "Please enter an Employee ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/employees/${employeeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee data');
      }
      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setError('Failed to load employee data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load employee data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [employeeId, toast]);

  const handleDownload = async () => {
    if (!employee) return;
    
    try {
      await generateIDCardPDF(employee);
      toast({
        title: "Success",
        description: "ID Card has been downloaded successfully!",
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate ID Card. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Generate Employee ID Card</h1>
      
      <div className="mb-6">
        <Label htmlFor="employeeId">Employee ID</Label>
        <div className="flex space-x-2">
          <Input
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Enter Employee ID"
          />
          <Button onClick={fetchEmployeeData} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center space-x-4">
          <Skeleton className="w-[340px] h-[540px]" />
          <Skeleton className="w-[340px] h-[540px]" />
        </div>
      ) : employee ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <FrontCard employee={employee} />
            <BackCard employee={employee} />
          </div>

          <Button onClick={handleDownload} className="mt-6">
            <Download className="mr-2 h-4 w-4" /> Download ID Card
          </Button>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No employee data available. Please enter an Employee ID and click `Fetch` to generate an ID card.
        </div>
      )}
    </div>
  );
}