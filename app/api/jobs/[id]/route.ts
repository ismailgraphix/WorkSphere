import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

      if (user.role !== 'ADMIN' && user.role !== 'HR') {
        return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const { id } = params;
    const jobData = await request.json();

    const updatedJob = await prisma.job.update({
      where: { id },
      data: jobData,
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

      if (user.role !== 'ADMIN' && user.role !== 'HR') {
        return NextResponse.json({ error: 'Unauthorized. Insufficient permissions.' }, { status: 403 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const { id } = params;

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}