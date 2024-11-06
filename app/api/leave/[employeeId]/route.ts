import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookies = request.headers.get('cookie');
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    let user;
    try {
      user = jwt.verify(token, JWT_SECRET);
      if (typeof user !== 'object' || !user.role || !user.id) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    if (user.role !== 'ADMIN' && user.role !== 'HR') {
      return NextResponse.json({ error: 'Permission denied. Only Admins and HR can update leave status.' }, { status: 403 });
    }

    const { status } = await request.json();
    const { id } = params;

    const updatedLeave = await prisma.leave.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedLeave, { status: 200 });
  } catch (error) {
    console.error('Error updating leave application:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employeeId = params.id;

    const leaves = await prisma.leave.findMany({
      where: {
        employeeId: employeeId,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.error('Error fetching employee leaves:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching employee leaves.' },
      { status: 500 }
    );
  }
}