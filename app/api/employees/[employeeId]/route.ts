import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Assuming you have Prisma setup
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function PUT(request: NextRequest, { params }: { params: { employeeId: string } }) {
  try {
    // Extract and verify JWT token from headers or cookies
    const cookies = request.headers.get('cookie')
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 })
    }

    let user
    try {
      user = jwt.verify(token, JWT_SECRET)

      if (typeof user !== 'object' || !user.role || !user.id) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 })
      }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 })
    }

    // Allow only 'ADMIN' or 'HR' roles to access this route
    if (user.role !== 'ADMIN' && user.role !== 'HR') {
      return NextResponse.json({ error: 'Permission denied. Only Admins and HR can access this resource.' }, { status: 403 })
    }

    const body = await request.json()
    const employeeId = params.employeeId

    // Update the employee based on the provided body data
    const updatedEmployee = await prisma.employee.update({
      where: {
        employeeId: employeeId,
      },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        gender: body.gender,
        dateOfBirth: new Date(body.dateOfBirth),
        address: body.address,
        nationalID: body.nationalID,
        position: body.position,
        departmentId: body.departmentId,
        dateOfJoining: new Date(body.dateOfJoining),
        employmentType: body.employmentType,
        employmentStatus: body.employmentStatus,
        maritalStatus: body.maritalStatus,
        emergencyContactName: body.emergencyContactName,
        emergencyContactPhone: body.emergencyContactPhone,
        emergencyContactRelationship: body.emergencyContactRelationship,
        salary: body.salary ? parseFloat(body.salary) : null,
        currency: body.currency || null,
        isProbation: body.isProbation === 'true',
        probationEndDate: body.probationEndDate ? new Date(body.probationEndDate) : null,
        contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : null,
        bankName: body.bankName || null,
        bankAccountNumber: body.bankAccountNumber || null,
        bankBranch: body.bankBranch || null,
        taxID: body.taxID || null,
        socialSecurityNumber: body.socialSecurityNumber || null,
        profileImage: body.profileImage || null,
        resumeLink: body.resumeLink || null,
        contractLink: body.contractLink || null,
        identityDocumentLink: body.identityDocumentLink || null,
      },
    })

    return NextResponse.json(updatedEmployee, { status: 200 })
  } catch (error) {
    console.error('Error updating employee:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { employeeId: string } }) {
  try {
    // Extract and verify JWT token from headers or cookies
    const cookies = request.headers.get('cookie')
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 })
    }

    let user
    try {
      user = jwt.verify(token, JWT_SECRET)

      if (typeof user !== 'object' || !user.role || !user.id) {
        return NextResponse.json({ error: 'Invalid token payload.' }, { status: 401 })
      }
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 })
    }

    // Allow only 'ADMIN' or 'HR' roles to access this route
    if (user.role !== 'ADMIN' && user.role !== 'HR'&& user.role !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'Permission denied. Only Admins and HR can access this resource.' }, { status: 403 })
    }

    const employeeId = params.employeeId

    // Fetch the employee from the database
    const employee = await prisma.employee.findUnique({
      where: {
        employeeId: employeeId,
      },
      include: {
        department: true,
      },
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found.' }, { status: 404 })
    }

    return NextResponse.json(employee, { status: 200 })
  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}



export async function DELETE(request: NextRequest, { params }: { params: { employeeId: string } }) {
    try {
      const { employeeId } = params;
  
      // Check if the employeeId exists in the request parameters
      if (!employeeId) {
        return NextResponse.json({ error: 'employeeId is required in the URL.' }, { status: 400 });
      }
  
      // Extract and verify JWT token from headers or cookies
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
  
      // Proceed with deleting the employee
      const deletedEmployee = await prisma.employee.delete({
        where: { employeeId }, // Use the employeeId from the URL parameters
      });
  
      return NextResponse.json({ message: 'Employee deleted successfully.', deletedEmployee }, { status: 200 });
    } catch (error) {
      console.error('Error deleting employee:', error);
      return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
  }
  
  