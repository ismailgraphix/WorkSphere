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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AddDepartmentModalProps {
  onDepartmentAdded: () => void
}

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ onDepartmentAdded }) => {
  const [name, setName] = useState("")
  const [departmentHeadEmployeeId, setDepartmentHeadEmployeeId] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    setError("")
    setLoading(true)

    if (!name || !departmentHeadEmployeeId) {
      setError("Please fill all required fields.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(
        "/api/departments",
        { name, departmentHeadEmployeeId, isActive },
        { withCredentials: true }
      )

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Department added successfully!",
        })
        onDepartmentAdded()
        setIsOpen(false)
        setName("")
        setDepartmentHeadEmployeeId("")
        setIsActive(true)
      }
    } catch (error) {
      console.error("Error adding department:", error)
      toast({
        title: "Error",
        description: "Failed to add department. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Add Department</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Department</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the details of the new department.
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
            value={departmentHeadEmployeeId}
            onChange={(e) => setDepartmentHeadEmployeeId(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <label htmlFor="isActive">Activate Department</label>
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Adding..." : "Add Department"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

