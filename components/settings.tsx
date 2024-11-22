"use client"

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UploadIcon, TrashIcon } from 'lucide-react';
import { useToast } from "../hooks/use-toast";

interface UserData {
  name: string;
  phoneNumber: string;
  email: string;
  employeeId: string;
  position: string;
  profileImage: string | null;
  bio?: string;
}

export default function Settings() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData({
        name: parsedUser.name || '',
        phoneNumber: parsedUser.phoneNumber || '',
        email: parsedUser.email || '',
        employeeId: parsedUser.employeeId || '',
        position: parsedUser.position || '',
        profileImage: parsedUser.profileImage || null,
        bio: parsedUser.bio || ''
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = () => {
    if (!userData) return;

    localStorage.setItem('user', JSON.stringify(userData));
    toast({
      title: "Success",
      description: "Your profile has been updated successfully.",
    });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex space-x-10">
      {/* Left Form Section */}
      <div className="w-2/3 bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <Input
              id="name"
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <Input
              id="phoneNumber"
              type="text"
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mt-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <Input
            id="email"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Employee ID */}
        <div className="mt-4">
          <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Employee ID</label>
          <Input
            id="employeeId"
            type="text"
            name="employeeId"
            value={userData.employeeId}
            onChange={handleInputChange}
            className="mt-1 block w-full"
            disabled
          />
        </div>

        {/* Position */}
        <div className="mt-4">
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
          <Input
            id="position"
            type="text"
            name="position"
            value={userData.position}
            onChange={handleInputChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Bio */}
        <div className="mt-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">BIO</label>
          <Textarea
            id="bio"
            name="bio"
            value={userData.bio}
            onChange={handleInputChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Save and Cancel Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button variant="default" onClick={handleSave}>Save</Button>
        </div>
      </div>

      {/* Right Avatar Section */}
      <div className="w-1/3 bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Photo</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={userData.profileImage || ''} alt={userData.name} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <Button variant="outline" className="mt-2 mb-2">
            <UploadIcon className="mr-2 h-5 w-5" />
            Update Photo
          </Button>
          <Button variant="destructive">
            <TrashIcon className="mr-2 h-5 w-5" />
            Delete
          </Button>
        </div>

        {/* Image Upload Area */}
        <div className="border border-dashed border-gray-400 rounded-md p-4 mt-4 flex items-center justify-center text-sm">
          <UploadIcon className="mr-2 h-5 w-5" />
          Click to upload or drag and drop
          <br />
          <span className="text-xs text-gray-500">SVG, PNG, JPG, or GIF (max. 800x800px)</span>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button variant="default" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  );
}