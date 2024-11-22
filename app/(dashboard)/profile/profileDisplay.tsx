'use client'

import { useState } from 'react'
//import Image from 'next/image'
import { User, Mail, Briefcase, BadgeIcon as IdCard, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
//import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "../../../hooks/use-toast"

interface UserData {
  id: string
  name: string
  email: string
  employeeId: string
  position: string
  role: string
  profileImage: string | null
}

export default function ProfileDisplay({ userData }: { userData: UserData }) {
  const [isUpdatingImage, setIsUpdatingImage] = useState(false)
  const [newImage, setNewImage] = useState<File | null>(null)
  const { toast } = useToast()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImage(file)
    }
  }

  const updateProfileImage = async () => {
    if (!newImage) return

    setIsUpdatingImage(true)
    const formData = new FormData()
    formData.append('profileImage', newImage)

    try {
      const response = await fetch('/api/user/update-profile-image', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Profile Image Updated",
          description: "Your profile image has been successfully updated.",
        })
        // You might want to refresh the page or update the userData state here
      } else {
        throw new Error('Failed to update profile image')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingImage(false)
      setNewImage(null)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        <CardDescription>Your personal and professional information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={userData.profileImage || '/placeholder.svg?height=96&width=96'} alt={userData.name} />
            <AvatarFallback><User className="w-12 h-12" /></AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-semibold">{userData.name}</h3>
            <p className="text-sm text-muted-foreground">{userData.position}</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Update Image</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Profile Image</DialogTitle>
                <DialogDescription>
                  Choose a new profile image to upload.
                </DialogDescription>
              </DialogHeader>
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
              <DialogFooter>
                <Button onClick={updateProfileImage} disabled={!newImage || isUpdatingImage}>
                  {isUpdatingImage ? "Updating..." : "Update Image"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{userData.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <IdCard className="w-4 h-4 text-muted-foreground" />
            <span>Employee ID: {userData.employeeId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span>{userData.position}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span>Role: {userData.role}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Edit Profile</Button>
      </CardFooter>
    </Card>
  )
}