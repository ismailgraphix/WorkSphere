
import LoginForm from '@/components/login-form'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Employee Management System',
  description: 'Login to access your employee dashboard',
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Please login to access your dashboard</p>
      </header>
      <main>
       
        <LoginForm/> 
      </main>
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  )
}