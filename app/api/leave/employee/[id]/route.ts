// File: app/api/leave/employee/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // First, get the employee record for this user
    const employee = await prisma.employee.findFirst({
      where: {
        id: userId, // Assuming this is how it's defined in your schema
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Now fetch leaves using the employee's ID
    const leaves = await prisma.leave.findMany({
      where: {
        employeeId: employee.id,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    console.log('Found leaves:', leaves); // Debug log

    return NextResponse.json(leaves);
  } catch (error) {
    console.error('Error fetching employee leaves:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching employee leaves.' },
      { status: 500 }
    );
  }
}