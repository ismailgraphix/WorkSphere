import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { differenceInBusinessDays, startOfYear, endOfYear } from 'date-fns';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Helper function to check if date is a weekend
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

// Helper function to calculate working days between dates
function getWorkingDays(startDate: Date, endDate: Date): number {
  return differenceInBusinessDays(endDate, startDate) + 1;
}

// Helper function to check annual leave limit
async function checkAnnualLeaveLimit(employeeId: string, startDate: Date, endDate: Date): Promise<boolean> {
  const year = startDate.getFullYear();
  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(new Date(year, 11, 31));

  // Get all approved leaves for this year
  const existingLeaves = await prisma.leave.findMany({
    where: {
      employeeId,
      status: 'APPROVED',
      startDate: {
        gte: yearStart,
      },
      endDate: {
        lte: yearEnd,
      },
    },
  });

  // Calculate total days already taken
  const daysTaken = existingLeaves.reduce((total, leave) => {
    return total + getWorkingDays(new Date(leave.startDate), new Date(leave.endDate));
  }, 0);

  // Calculate days being requested
  const daysRequested = getWorkingDays(startDate, endDate);

  // Check if total would exceed 30 days
  return (daysTaken + daysRequested) <= 30;
}

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

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if dates are weekends
    if (isWeekend(start) || isWeekend(end)) {
      return NextResponse.json({ 
        error: 'Leave cannot start or end on weekends.' 
      }, { status: 400 });
    }

    // Check working days limit
    const workingDays = getWorkingDays(start, end);
    
    // Check annual leave limit
    const withinLimit = await checkAnnualLeaveLimit(employeeId, start, end);
    if (!withinLimit) {
      return NextResponse.json({ 
        error: 'Annual leave limit of 30 days would be exceeded.' 
      }, { status: 400 });
    }

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
        startDate: start,
        endDate: end,
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
            employeeId: true, // Include employee ID for PDF
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
    return NextResponse.json({
      ...leaveApplication,
      workingDays // Include working days in response
    }, { status: 201 });
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