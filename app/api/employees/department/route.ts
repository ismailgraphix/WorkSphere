import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

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

      if (typeof user !== 'object' || !user.id) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    // Fetch the employee's department
    const employee = await prisma.employee.findUnique({
      where: { id: user.id },
      include: {
        department: {
          include: {
            departmentHead: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
              }
            },
            employees: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                image: true,
                position: true,
              }
            },
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            },
          },
        },
      },
    });

    if (!employee || !employee.department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    // Fetch recent leave count
    const recentLeaveCount = await prisma.leave.count({
      where: {
        departmentId: employee.department.id,
        status: 'APPROVED',
        startDate: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
        },
      },
    });

    const departmentData = {
      ...employee.department,
      recentLeaveCount,
    };

    return NextResponse.json(departmentData, { status: 200 });
  } catch (error) {
    console.error('Error fetching department data:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the department data.' }, { status: 500 });
  }
}