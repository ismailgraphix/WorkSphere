import { NextResponse } from 'next/server'; 
import { prisma } from '@/lib/db';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(request: Request) {
  // Extract JWT token from Authorization header
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 });
  }

  let user: string | JwtPayload;
  try {
    // Verify and decode the token
    user = jwt.verify(token, JWT_SECRET);
    
    // Check if user is a valid object and has necessary properties
    if (typeof user !== 'object' || !user.role || !user.id) {
      return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
    }

  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
  }

  // Admin role check
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Permission denied. Admins only.' }, { status: 403 });
  }

  // Parse request body for department data
  const { name, departmentHeadId } = await request.json();

  if (!name || !departmentHeadId) {
    return NextResponse.json({ error: 'Name and department head are required.' }, { status: 400 });
  }

  try {
    // Create a new department record
    const department = await prisma.department.create({
      data: {
        name,
        departmentHeadId,
        createdById: user.id as string, // Ensure user.id is treated as a string
      },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
