import LoginForm from '@/components/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | WorkSphere',
  description: 'Login to access your employee dashboard',
}

export default function Home() {
  return <LoginForm />
}