import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Assuming you have a Prisma client instance
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure this matches the one used in login

export async function POST(request: NextRequest) {
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
      
      // Check if user is a valid object and has the necessary properties
      if (typeof user !== 'object' || !user.role || !user.id) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
      }

    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    // Parse request body for department data
    const { name, departmentHeadId } = await request.json();

    if (!name || !departmentHeadId) {
      return NextResponse.json({ error: 'Name and department head are required.' }, { status: 400 });
    }

    // Create a new department record
    const department = await prisma.department.create({
      data: {
        name,
        departmentHeadId,
        createdById: user.id as string, // Ensure user.id is treated as a string
        isActive: true, // Default to false as per your requirement
      },
    });

    // If the user is an admin, they can also set isActive
    if (user.role === 'ADMIN') {
      // Optionally, add logic here if you want admins to immediately activate the department
    }

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
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

      // Check if user is a valid object and has the necessary properties
      if (typeof user !== 'object' || !user.role || !user.id) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    // Allow only 'ADMIN' or 'HR' roles to access this route
    if (user.role !== 'ADMIN' && user.role !== 'HR') {
      return NextResponse.json({ error: 'Permission denied. Only Admins and HR can access this resource.' }, { status: 403 });
    }

    // Fetch all departments without filtering by isActive, allowing for both active and inactive departments
    const departments = await prisma.department.findMany({
      include: {
        departmentHead: {
          select: {
            id: true,
            name: true, // Ensure department head's name is fetched
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true, // Fetch the name of the user who created the department if needed
          },
        },
      },
    });

    return NextResponse.json(departments, { status: 200 });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}