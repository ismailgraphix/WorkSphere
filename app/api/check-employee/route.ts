import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { emailOrEmployeeId } = body;

    if (!emailOrEmployeeId) {
      return NextResponse.json(
        { message: 'Missing required field: emailOrEmployeeId' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findFirst({
      where: {
        OR: [
          { email: emailOrEmployeeId },
          { employeeId: emailOrEmployeeId },
        ],
        employmentStatus: 'ACTIVE',
      },
      select: {
        id: true,
        email: true,
        employeeId: true,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: 'No active employee found with the provided email or employee ID' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Active employee found', employeeId: employee.employeeId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Check employee error:', error);
    return NextResponse.json(
      { message: 'Something went wrong while checking employee status' },
      { status: 500 }
    );
  }
}