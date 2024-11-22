'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2 } from 'lucide-react'

type FormData = {
  name: string
  email: string
  password: string
  position: string
  employeeId: string
  profileImage?: string
  role: 'ADMIN' | 'HR' | 'EMPLOYEE'
}

type Employee = {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  position: string
  profileImage: string | null
  department: {
    name: string
  }
}

export default function AddUserForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<FormData>()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const fetchEmployeeData = async () => {
    const employeeId = getValues("employeeId")
    if (!employeeId) {
      setServerError("Please enter an Employee ID")
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.get(`/api/employees/${employeeId}`)
      const employee = response.data
      setSelectedEmployee(employee)
      setValue('name', `${employee.firstName} ${employee.lastName}`)
      setValue('email', employee.email)
      setValue('position', employee.position)
      setValue('profileImage', employee.profileImage || '')
      setServerError(null)
    } catch (error) {
      console.error('Error fetching employee:', error)
      setServerError('Employee not found. Please check the Employee ID.')
      setSelectedEmployee(null)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setServerError(null)

    try {
      const response = await axios.post('/api/auth/register', data)
      if (response.status === 201) {
        onSuccess()
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setServerError(error.response.data.message || 'An error occurred during registration')
      } else {
        setServerError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="employeeId">Employee ID</Label>
        <div className="flex space-x-2">
          <Input
            id="employeeId"
            {...register("employeeId", { required: "Employee ID is required" })}
            className={errors.employeeId ? "border-red-500" : ""}
          />
          <Button type="button" onClick={fetchEmployeeData} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch'}
          </Button>
        </div>
        {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId.message}</p>}
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name", { required: "Name is required" })}
          className={errors.name ? "border-red-500" : ""}
          disabled={!selectedEmployee}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          className={errors.email ? "border-red-500" : ""}
          disabled={!selectedEmployee}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password", { 
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long"
            }
          })}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          {...register("position", { required: "Position is required" })}
          className={errors.position ? "border-red-500" : ""}
          disabled={!selectedEmployee}
        />
        {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
      </div>

      <div>
        <Label htmlFor="profileImage">Profile Image URL</Label>
        <Input
          id="profileImage"
          {...register("profileImage")}
          disabled={!selectedEmployee}
        />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Controller
          name="role"
          control={control}
          rules={{ required: "Role is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="EMPLOYEE">Employee</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
      </div>

      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading || !selectedEmployee}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : (
          'Register'
        )}
      </Button>
    </form>
  )
}