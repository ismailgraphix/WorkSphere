import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET(request: NextRequest) {
  try {
    const cookies = request.headers.get('cookie');
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    let user;
    try {
      user = jwt.verify(token, JWT_SECRET);
      if (typeof user !== 'object' || !user.id) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const leaveApplications = await prisma.leave.findMany({
      where: { employeeId: user.id },
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(leaveApplications, { status: 200 });
  } catch (error) {
    console.error('Error fetching employee leave applications:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}