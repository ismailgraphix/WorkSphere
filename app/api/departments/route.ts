import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(request: NextRequest) {
  try {
    // Extract JWT from cookies
    const cookies = request.headers.get('cookie');
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    let decodedToken;
    try {
      // Verify and decode the token
      decodedToken = jwt.verify(token, JWT_SECRET) as { employeeId: string, role: string };
      
      // Check if decodedToken is a valid object and has the necessary properties
      if (typeof decodedToken !== 'object' || !decodedToken.role || !decodedToken.employeeId) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    // Fetch the user based on employeeId
    const user = await prisma.user.findUnique({
      where: { employeeId: decodedToken.employeeId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Parse request body for department data
    const { name, departmentHeadEmployeeId } = await request.json();

    if (!name || !departmentHeadEmployeeId) {
      return NextResponse.json({ error: 'Name and department head employee ID are required.' }, { status: 400 });
    }

    // Find the department head user
    const departmentHead = await prisma.user.findUnique({
      where: { employeeId: departmentHeadEmployeeId }
    });

    if (!departmentHead) {
      return NextResponse.json({ error: 'Department head not found.' }, { status: 404 });
    }

    // Create a new department record
    const department = await prisma.department.create({
      data: {
        name,
        departmentHeadId: departmentHead.id,
        createdById: user.id,
        isActive: true,
      },
    });

    // If the user is an admin, they can also set isActive
    if (decodedToken.role === 'ADMIN') {
      // Optionally, add logic here if you want admins to immediately activate the department
    }

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

// The GET function remains unchanged
export async function GET(request: NextRequest) {
  try {
    // Extract JWT from cookies
    const cookies = request.headers.get('cookie');
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    let decodedToken;
    try {
      // Verify and decode the token
      decodedToken = jwt.verify(token, JWT_SECRET) as { employeeId: string, role: string };

      // Check if decodedToken is a valid object and has the necessary properties
      if (typeof decodedToken !== 'object' || !decodedToken.role || !decodedToken.employeeId) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    // Allow only 'ADMIN' or 'HR' roles to access this route
    if (decodedToken.role !== 'ADMIN' && decodedToken.role !== 'HR') {
      return NextResponse.json({ error: 'Permission denied. Only Admins and HR can access this resource.' }, { status: 403 });
    }

    // Fetch all departments
    const departments = await prisma.department.findMany({
      include: {
        departmentHead: {
          select: {
            id: true,
            name: true,
            employeeId: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            employeeId: true,
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