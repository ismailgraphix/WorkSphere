'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "../hooks/use-toast"

export default function TwoStepLoginForm() {
  const [step, setStep] = useState(1)
  const [emailOrEmployeeId, setEmailOrEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/check-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrEmployeeId }),
      })

      const data = await response.json()

      if (response.ok) {
        setEmployeeId(data.employeeId)
        setStep(2)
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Check employee error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })
        router.push('/dashboard') // Redirect to dashboard or appropriate page
      } else {
        toast({
          title: "Login Failed",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          {step === 1
            ? "Enter your email or employee ID to proceed."
            : "Enter your password to complete login."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <form onSubmit={handleStep1Submit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="emailOrEmployeeId">Email or Employee ID</Label>
                <Input
                  id="emailOrEmployeeId"
                  placeholder="Enter your email or employee ID"
                  value={emailOrEmployeeId}
                  onChange={(e) => setEmailOrEmployeeId(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === 2 && (
          <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
        )}
        <Button type="submit" disabled={isLoading} onClick={step === 1 ? handleStep1Submit : handleStep2Submit}>
          {isLoading ? "Processing..." : (step === 1 ? "Next" : "Login")}
        </Button>
      </CardFooter>
    </Card>
  )
}