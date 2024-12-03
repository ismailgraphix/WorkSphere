import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';  // Make sure to set this in your environment variables

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailOrEmployeeId, password } = body;

    // Validate input
    if (!emailOrEmployeeId || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if the user exists
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrEmployeeId },
          { employeeId: emailOrEmployeeId },
        ],
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Get the employee record
    const employee = await prisma.employee.findUnique({
      where: {
        employeeId: user.employeeId
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '11h' }  // Token expiration (11 hours)
    );

    // Create the response
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          employeeId: user.employeeId,
          position: user.position,
          role: user.role,
          profileImage: user.profileImage,
          employee: employee // Include the employee record
        }
      },
      { status: 200 }
    );

    // Set the token in an HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 39600, // 11 hours in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}