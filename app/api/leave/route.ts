import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(request: NextRequest) {
  try {
    const { 
      startDate, 
      endDate, 
      reason, 
      leaveType, 
      position, 
      departmentId, 
      isPaidLeave, 
      employeeId,
      createdById // Make sure this is passed from the frontend
    } = await request.json();

    if (!startDate || !endDate || !reason || !leaveType || !position || !departmentId || !employeeId || !createdById) {
      return NextResponse.json({ error: 'All required fields must be provided.' }, { status: 400 });
    }

    const leaveApplication = await prisma.leave.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        leaveType,
        position,
        isPaidLeave: isPaidLeave ?? false,
        status: 'PENDING',
        employee: {
          connect: { id: employeeId }
        },
        department: {
          connect: { id: departmentId }
        },
        createdBy: {
          connect: { id: createdById }
        }
      },
    });

    return NextResponse.json(leaveApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating leave application:', error);
    return NextResponse.json({ error: 'An error occurred while creating the leave application.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Extract JWT from cookies
    const cookies = request.headers.get('cookie');
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    let user;
    try {
      // Verify and decode the token
      user = jwt.verify(token, JWT_SECRET);

      if (typeof user !== 'object' || !user.role || !user.id) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    // Allow only 'ADMIN' or 'HR' roles to access all leave requests
    if (user.role !== 'ADMIN' && user.role !== 'HR') {
      return NextResponse.json({ error: 'Permission denied. Only Admins and HR can access this resource.' }, { status: 403 });
    }

    // Fetch all leave applications with associated employee and department details
    const leaveApplications = await prisma.leave.findMany({
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(leaveApplications, { status: 200 });
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
