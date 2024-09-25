"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UploadIcon, TrashIcon } from "lucide-react"; // Replace with ShadCN icon

const Settings = () => {
  const [userData, setUserData] = useState({
    fullName: "Devid Jhon",
    phoneNumber: "+990 3343 7865",
    email: "devidjond45@gmail.com",
    username: "devidjhon24",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    profilePicture: "/path-to-user-image.jpg",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex space-x-10">
      {/* Left Form Section */}
      <div className="w-2/3 bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <Input
              type="text"
              name="fullName"
              value={userData.fullName}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <Input
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
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <Input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Username */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <Input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Bio */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">BIO</label>
          <Textarea
            name="bio"
            value={userData.bio}
            onChange={handleInputChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Save and Cancel Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save</Button>
        </div>
      </div>

      {/* Right Avatar Section */}
      <div className="w-1/3 bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Photo</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={userData.profilePicture} alt={userData.fullName} />
            <AvatarFallback>{userData.fullName.charAt(0)}</AvatarFallback>
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
          <span className="text-xs text-gray-500">SVG, PNG, JPG, or GIF (max, 800x800px)</span>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button variant="primary">Save</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
