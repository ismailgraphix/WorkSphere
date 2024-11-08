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

    const attendanceRecords = await prisma.attendance.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    const formattedRecords = attendanceRecords.map(record => ({
      id: record.id,
      userId: record.userId,
      userName: record.user.name,
      date: record.date.toISOString(),
      checkIn: record.checkIn.toISOString(),
      checkOut: record.checkOut?.toISOString() || null,
    }));

    return NextResponse.json(formattedRecords, { status: 200 });
  } catch (error) {
    console.error('Error fetching all attendance records:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}