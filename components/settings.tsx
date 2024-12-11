"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface UserData {
  id: string
  name: string
  email: string
  position: string
  employeeId: string
  profileImage: string | null
  role: 'ADMIN' | 'HR' | 'EMPLOYEE'
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUserData({
        id: parsedUser.id || '',
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        position: parsedUser.position || '',
        employeeId: parsedUser.employeeId || '',
        profileImage: parsedUser.profileImage || null,
        role: parsedUser.role || 'EMPLOYEE'
      })
    }
  }, [])

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={userData.profileImage || ''} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mb-2">{userData.name}</h2>
              <p className="text-sm text-muted-foreground">{userData.position}</p>
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <div>
                <Label htmlFor="id">User ID</Label>
                <Input id="id" value={userData.id} disabled />
              </div>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={userData.name} disabled />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={userData.email} disabled />
              </div>
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" value={userData.employeeId} disabled />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" value={userData.position} disabled />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={userData.role} disabled />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}