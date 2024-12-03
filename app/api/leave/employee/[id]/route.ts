import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employeeId = params.id;
    console.log('Fetching leaves for employee ID:', employeeId);

    // First check if the employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      console.log('No employee found:', employeeId);
      return NextResponse.json({ 
        error: 'Employee not found.' 
      }, { status: 404 });
    }

    // Now fetch leaves using the employee's ID directly
    const leaves = await prisma.leave.findMany({
      where: {
        employeeId: employeeId,
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
        approvedBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Found ${leaves.length} leaves for employee:`, employeeId);
    return NextResponse.json(leaves);
  } catch (error) {
    console.error('Error fetching employee leaves:', error);
    return NextResponse.json({ 
      error: 'An error occurred while fetching employee leaves.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, leaveId, rejectionReason, approvedById } = await request.json();
    
    // Optional: Validate that the leave belongs to the employee
    const leave = await prisma.leave.findUnique({
      where: { id: leaveId },
      select: { employeeId: true }
    });

    if (!leave || leave.employeeId !== params.id) {
      return NextResponse.json({ 
        error: 'Leave request not found or does not belong to this employee' 
      }, { status: 404 });
    }

    const updatedLeave = await prisma.leave.update({
      where: { id: leaveId },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
        approvedBy: status === 'APPROVED' ? {
          connect: { id: approvedById }
        } : undefined
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
        approvedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedLeave, { status: 200 });
  } catch (error) {
    console.error('Error updating employee leave:', error);
    return NextResponse.json({ 
      error: 'An error occurred while updating employee leave.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}