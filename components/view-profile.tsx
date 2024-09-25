'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const ViewProfile = () => {
  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user details from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserDetails(JSON.parse(storedUser));
    }
  }, []);

  if (!userDetails) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src="/path-to-avatar.jpg" alt={userDetails.name} />
          <AvatarFallback>{userDetails.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="mt-4 text-lg font-semibold">{userDetails.name}</CardTitle>
        <p className="text-sm text-gray-500 capitalize">{userDetails.role}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <Label className="font-semibold">Name</Label>
          <p>{userDetails.name}</p>
        </div>
        <div className="flex justify-between">
          <Label className="font-semibold">Email</Label>
          <p>{userDetails.email}</p>
        </div>
        <div className="flex justify-between">
          <Label className="font-semibold">Role</Label>
          <p className="capitalize">{userDetails.role}</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline">Edit Profile</Button>
        <Button
          variant="destructive"
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
        >
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ViewProfile;
