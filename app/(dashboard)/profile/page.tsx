import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import ProfileDisplay from './profileDisplay'

const prisma = new PrismaClient()

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      employeeId: true,
      position: true,
      role: true,
      profileImage: true,
    },
  })
  return user
}

export default async function ProfilePage() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  if (!token) {
    redirect('/login')
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as { id: string }
    const userData = await getUserData(decoded.id)

    if (!userData) {
      redirect('/login')
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <ProfileDisplay userData={userData} />
      </div>
    )
  } catch (error) {
    console.error('Error verifying token:', error)
    redirect('/login')
  }
}