import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Adjust this import based on your project structure
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure this matches the one used in login

type DepartmentWithRelations = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  departmentHeadId: string | null;
  createdById: string;
  departmentHead: {
    id: string;
    name: string;
    employeeId: string;
    employee: {
      id: string;
      firstName: string;
      lastName: string;
      employeeId: string;
    } | null;
  } | null;
  employees: Array<{
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
  }>;
  Leave: Array<{
    id: string;
    startDate: Date;
    endDate: Date;
    status: string;
    employee: {
      firstName: string;
      lastName: string;
      employeeId: string;
    };
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { departmentId: string } }
) {
  try {
    const cookies = request.headers.get('cookie');
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET) as { employeeId: string, role: string };

    if (decodedToken.role !== 'ADMIN' && decodedToken.role !== 'HR') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const department = await prisma.department.findUnique({
      where: { id: params.departmentId },
      include: {
        departmentHead: {
          include: {
            employee: true
          }
        },
        employees: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
          },
        },
        Leave: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            employee: {
              select: {
                firstName: true,
                lastName: true,
                employeeId: true,
              },
            },
          },
        },
      },
    }) as DepartmentWithRelations;

    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    const transformedDepartment = {
      ...department,
      departmentHead: department.departmentHead?.employee ? {
        id: department.departmentHead.employee.id,
        employeeId: department.departmentHead.employee.employeeId,
        firstName: department.departmentHead.employee.firstName,
        lastName: department.departmentHead.employee.lastName,
        name: `${department.departmentHead.employee.firstName} ${department.departmentHead.employee.lastName}`,
      } : null,
      employees: department.employees.map(emp => ({
        ...emp,
        name: `${emp.firstName} ${emp.lastName}`,
      })),
      leaves: department.Leave.map(leave => ({
        ...leave,
        employee: {
          ...leave.employee,
          name: `${leave.employee.firstName} ${leave.employee.lastName}`,
        },
      })),
    };

    console.log('Transformed Department:', transformedDepartment);
    return NextResponse.json(transformedDepartment);
  } catch (error) {
    console.error('Error fetching department details:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { departmentId: string } }) {
  try {
    const { departmentId } = params;
    const cookies = request.headers.get('cookie');
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { employeeId: string, role: string };
      if (typeof decodedToken !== 'object' || !decodedToken.role || !decodedToken.employeeId) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    // Parse request body
    const { name, departmentHeadEmployeeId, isActive } = await request.json();

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

    // Update the department
    const updatedDepartment = await prisma.department.update({
      where: { id: departmentId },
      data: {
        name,
        departmentHeadId: departmentHead.id,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(updatedDepartment, { status: 200 });
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { departmentId: string } }) {
  try {
    const { departmentId } = params;
    const cookies = request.headers.get('cookie');
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { employeeId: string, role: string };
      if (typeof decodedToken !== 'object' || !decodedToken.role || !decodedToken.employeeId) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    // Allow only 'ADMIN' or 'HR' roles
    if (decodedToken.role !== 'ADMIN' && decodedToken.role !== 'HR') {
      return NextResponse.json({ error: 'Permission denied. Only Admins and HR can access this resource.' }, { status: 403 });
    }

    await prisma.department.delete({
      where: { id: departmentId },
    });

    return NextResponse.json({ message: 'Department deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
