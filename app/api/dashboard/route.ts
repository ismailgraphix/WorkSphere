import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [employees, departments, jobs, attendance] = await Promise.all([
      prisma.employee.count(),
      prisma.department.count(),
      prisma.job.count({ where: { status: 'OPEN' } }),
      prisma.attendance.findMany({
        where: {
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
          },
        },
        select: {
          date: true,
          checkIn: true,
          checkOut: true,
        },
      }),
    ]);

    const attendanceData = Array.from({ length: 31 }, (_, i) => {
      const date = new Date(new Date().getFullYear(), new Date().getMonth(), i + 1);
      const dayAttendance = attendance.filter(a => a.date.getDate() === date.getDate());
      const presentCount = dayAttendance.filter(a => a.checkIn && a.checkOut).length;
      const totalCount = employees; // Assuming all employees should check in every day
      const attendanceRate = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

      return {
        date: date.toISOString().split('T')[0],
        attendanceRate: Math.round(attendanceRate * 100) / 100,
      };
    });

    return NextResponse.json({
      totalEmployees: employees,
      totalDepartments: departments,
      openJobs: jobs,
      attendanceData,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}