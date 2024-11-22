'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginForm() {
  const [emailOrEmployeeId, setEmailOrEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrEmployeeId, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store user data in local storage
        localStorage.setItem('user', JSON.stringify(data.user));

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })
        
        // Redirect based on user role
        switch (data.user.role) {
          case 'ADMIN':
            router.push('/admin')
            break
          case 'HR':
            router.push('/hr')
            break
          case 'EMPLOYEE':
            router.push('/employee')
            break
          default:
            router.push('/')
        }
      } else {
        throw new Error(data.message || 'Login failed')
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
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
        <CardDescription>Enter your email or employee ID and password to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
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
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit" disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </CardFooter>
    </Card>
  )
}