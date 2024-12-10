'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "../hooks/use-toast"
import { Eye, EyeOff, WavesIcon as Wave } from 'lucide-react'

export default function LoginForm() {
  const [emailOrEmployeeId, setEmailOrEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
        localStorage.setItem('user', JSON.stringify(data.user));

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })
        
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
    <div className="flex min-h-screen">
      <div className="hidden md:block relative w-1/2">
        <Image
          src="/assets/campaign-creators-gMsnXqILjp4-unsplash.jpg"
          alt="HRMS Dashboard"
          layout="fill"
          objectFit="cover"
          priority
          className="brightness-50"
        />
        <div className="absolute bottom-10 left-10 text-white z-10">
          <h1 className="text-5xl font-bold mb-4">WORKSPHERE<br/>Dashboard</h1>
          <p className="text-xl">Manage your workforce efficiently</p>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 bg-black text-white flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <div className="bg-purple-600 rounded-xl px-4 py-2 flex items-center gap-2">
              <Wave className="h-6 w-6" />
              <span className="text-2xl font-bold">WORKSPHERE</span>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold">
              Welcome <span className="inline-block animate-wave">👋</span>
            </h2>
            <p className="text-gray-400 mt-2">Please login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Email or Employee ID"
                value={emailOrEmployeeId}
                onChange={(e) => setEmailOrEmployeeId(e.target.value)}
                className="h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Removed Remember Me checkbox as it's not in the original workflow */}
              </div>
              <button
                type="button"
                className="text-sm text-purple-500 hover:text-purple-400"
                onClick={() => router.push('/forgot-password')}
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

        </div>
      </div>

      <style jsx global>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-wave {
          animation: wave 1.5s infinite;
        }
      `}</style>
    </div>
  )
}