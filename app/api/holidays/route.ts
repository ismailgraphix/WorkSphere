import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Assuming you have a Prisma client instance
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure this matches the one used in login

export async function POST(request: NextRequest) {
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
        console.error('Token verification failed:', error);
        return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
      }
  
      const { title, date, isRecurring } = await request.json();
  
      if (!title || !date) {
        return NextResponse.json({ error: 'Title and date are required.' }, { status: 400 });
      }
  
      const holiday = await prisma.holiday.create({
        data: {
          title,
          date: new Date(date), // Ensure this is a Date object
          isRecurring,
          createdById: user.id,
          updatedById: user.id,
        },
      });
  
      return NextResponse.json(holiday, { status: 201 });
    } catch (error) {
      console.error('Error creating holiday:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
  }

export async function GET(request: NextRequest) {
  try {
    // Fetch all holidays without any restrictions
    const holidays = await prisma.holiday.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true, // Fetch the name of the user who created the holiday
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true, // Fetch the name of the user who updated the holiday
          },
        },
      },
    });

    return NextResponse.json(holidays, { status: 200 });
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
