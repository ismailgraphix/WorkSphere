"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "../components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; // Import the toast hook

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast(); // Initialize toast

  const redirectUser = (role) => {
    switch (role) {
      case 'ADMIN':
        return '/admin';
      case 'HR':
        return '/hr';
      case 'EMPLOYEE':
        return '/employee';
      default:
        return '/'; // Fallback route
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data; // Ensure token is included in the response

      // Log the user object to check the role
      console.log('User logged in:', user);

      // Store token and user info in localStorage
      localStorage.setItem('token', token); // Changed to localStorage for consistency
      localStorage.setItem('user', JSON.stringify(user)); // Store user in localStorage

      // Show success toast
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      // Redirect based on user role
      const redirectPath = redirectUser(user.role);
      console.log('Redirecting to:', redirectPath); // Log the redirect path
      router.push(redirectPath);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login failed:', error.response?.data?.message || error.message);
        
        // Show error toast
        toast({
          title: "Login Failed",
          description: error.response?.data?.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
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
