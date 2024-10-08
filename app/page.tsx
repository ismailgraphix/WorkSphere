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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const redirectUser = (role) => {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'HR':
        return '/hr';
      case 'EMPLOYEE':
        return '/employee';
      default:
        return '/';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data; // Ensure token is included in the response

      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      console.log('User logged in:', user);

      // Redirect based on user role
      const redirectPath = redirectUser(user.role);
      router.push(redirectPath);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login failed:', error.response?.data?.message || error.message);
        // Optionally, you can set an error state to display it in the UI
      }
    } finally {
      setIsLoading(false); // Stop loading
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
            placeholder="admin@example.com"
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
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default Login;
