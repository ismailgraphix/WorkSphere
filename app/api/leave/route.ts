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
      console.log('No token provided');
      return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    let user;
    try {
      // Verify and decode the token
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
      where: {
        employee: { isNot: undefined },  // Ensure employee exists
        department: { isNot: undefined }  // Ensure department exists
      }
    });
    if (!leaveApplications || leaveApplications.length === 0) {
      console.log('No leave applications found');
      return NextResponse.json([], { status: 200 });
    }

    console.log('Successfully fetched leave applications:', leaveApplications.length);
    return NextResponse.json(leaveApplications, { status: 200 });
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    return NextResponse.json({ error: 'Something went wrong.', details: (error as Error).message }, { status: 500 });
  }
}