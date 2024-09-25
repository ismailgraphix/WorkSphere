"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "../components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const user = response.data.user;

      // Store user details in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      console.log('User logged in:', user);

      // Redirect based on user role
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else if (user.role === 'HR') {
        router.push('/hr');
      } else if (user.role === 'EMPLOYEE') {
        router.push('/employee');
      } else {
        router.push('/');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login failed:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        
        <div className="mb-4">
          <Label htmlFor="email" className="block mb-1">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="robertallen@example.com"
            required
          />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="password" className="block mb-1">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="**********"
            required
          />
        </div>
        
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
};

export default Login;
