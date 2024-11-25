// app/api/users/route.ts
import {  NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        position: true,
        employeeId: true,
        profileImage: true,
        role: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Ensure the database connection is closed
  }
}