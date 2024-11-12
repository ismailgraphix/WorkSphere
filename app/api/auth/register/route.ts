import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, position, employeeId, profileImage, role } = await req.json();

    // Validate required fields
    if (!name || !email || !password || !position || !employeeId || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['ADMIN', 'HR', 'EMPLOYEE'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    // Check if user with email already exists
    const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingUserByEmail) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
    }

    // Check if user with employeeId already exists
    const existingUserByEmployeeId = await prisma.user.findUnique({ where: { employeeId } });
    if (existingUserByEmployeeId) {
      return NextResponse.json({ message: 'User with this employee ID already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        position,
        employeeId,
        profileImage,
        role,
      },
    });

    // Remove password from the response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ message: 'User registered successfully', user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Something went wrong during registration' }, { status: 500 });
  }
}