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

    const { type } = await request.json();
    const userId = user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (type === 'checkIn') {
      if (attendance) {
        return NextResponse.json({ error: 'Already checked in today' }, { status: 400 });
      }
      attendance = await prisma.attendance.create({
        data: {
          userId,
          date: new Date(),
          checkIn: new Date(),
        },
      });
    } else if (type === 'checkOut') {
      if (!attendance) {
        return NextResponse.json({ error: 'No check-in record found for today' }, { status: 400 });
      }
      if (attendance.checkOut) {
        return NextResponse.json({ error: 'Already checked out today' }, { status: 400 });
      }
      attendance = await prisma.attendance.update({
        where: { id: attendance.id },
        data: { checkOut: new Date() },
      });
    }

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    console.error('Error handling attendance:', error);
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
      
      if (typeof user !== 'object' || !user.id) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const userId = user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(attendance, { status: 200 });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}