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
      createdById,
      employeeId 
    } = await request.json();

    console.log('Creating leave with data:', { createdById, employeeId, startDate, endDate, leaveType });

    // First, find the employee record directly
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { user: true }
    });

    if (!employee) {
      console.log('No employee found:', employeeId);
      return NextResponse.json({ 
        error: 'Employee not found.' 
      }, { status: 404 });
    }

    // Create the leave application
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
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        department: {
          select: {
            name: true
          }
        },
        createdBy: {
          select: {
            name: true
          }
        }
      }
    });

    console.log('Leave application created:', leaveApplication);
    return NextResponse.json(leaveApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating leave application:', error);
    return NextResponse.json({ 
      error: 'An error occurred while creating the leave application.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Extract JWT from cookies
    const cookies = request.headers.get('cookie');
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      console.log('No token provided');
      return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    let user;
    try {
      user = jwt.verify(token, JWT_SECRET) as { role?: string, id?: string };
      if (typeof user !== 'object' || !user.role || !user.id) {
        console.log('Invalid token payload:', user);
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    // Allow only 'ADMIN' or 'HR' roles to access all leave requests
    if (user.role !== 'ADMIN' && user.role !== 'HR') {
      console.log('Permission denied for role:', user.role);
      return NextResponse.json({ error: 'Permission denied. Only Admins and HR can access this resource.' }, { status: 403 });
    }

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
        createdBy: {
          select: {
            name: true,
          },
        },
        approvedBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(leaveApplications, { status: 200 });
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}