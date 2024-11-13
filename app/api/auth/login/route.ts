import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId, password } = body;

    if (!employeeId || !password) {
      return NextResponse.json(
        { message: 'Missing required fields: employeeId and password' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: { employeeId: employeeId },
      select: {
        id: true,
        email: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        position: true,
      },
    });

    if (!employee) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: employee.email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = sign(
      {
        userId: user.id,
        email: user.email,
        employeeId: employee.employeeId,
      },
      process.env.JWT_SECRET || '',
      { expiresIn: '1d' }
    );

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          position: employee.position,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day in seconds
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Something went wrong during login' },
      { status: 500 }
    );
  }
}