import React, { useState } from 'react'
import axios from 'axios'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Department } from '@/types/department'

interface EditDepartmentModalProps {
  isOpen: boolean
  onClose: () => void
  department: Department
  onDepartmentUpdated: () => void
}

export const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({ 
  isOpen, 
  onClose, 
  department, 
  onDepartmentUpdated 
}) => {
  const [name, setName] = useState(department.name)
  const [departmentHeadId, setDepartmentHeadId] = useState(department.departmentHead?.employeeId || "")
  const [isActive, setIsActive] = useState(department.isActive)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleUpdate = async () => {
    setError("")
    setLoading(true)

    if (!name) {
      setError("Please fill in the department name.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.put(
        `/api/departments/${department.id}`,
        { name, departmentHeadEmployeeId: departmentHeadId, isActive },
        { withCredentials: true }
      )

      if (response.status === 200) {
        toast({
          title: "Department Updated",
          description: "The department has been successfully updated.",
        })
        onDepartmentUpdated()
        onClose()
      }
    } catch (error) {
      console.error("Error updating department:", error)
      toast({
        title: "Error",
        description: "Failed to update department. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Department</AlertDialogTitle>
          <AlertDialogDescription>
            Update the details of the department.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Department Head Employee ID"
            value={departmentHeadId}
            onChange={(e) => setDepartmentHeadId(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <label htmlFor="isActive">Activate</label>
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update Department"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

