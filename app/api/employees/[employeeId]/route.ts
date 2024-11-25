import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Assuming you have Prisma setup
import jwt from 'jsonwebtoken';
import { EmploymentType, MaritalStatus, Currency, EmploymentStatus } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function PUT(request: NextRequest, { params }: { params: { employeeId: string } }) {
  try {
    const employeeData = await request.json()
    const { employeeId } = params

    // Verify the employee exists first
    const existingEmployee = await prisma.employee.findUnique({
      where: { employeeId: employeeId },
    })

    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Parse and validate dates
    const dateOfBirth = employeeData.dateOfBirth ? new Date(employeeData.dateOfBirth) : undefined
    const dateOfJoining = employeeData.dateOfJoining ? new Date(employeeData.dateOfJoining) : undefined
    const probationEndDate = employeeData.probationEndDate ? new Date(employeeData.probationEndDate) : undefined
    const contractEndDate = employeeData.contractEndDate ? new Date(employeeData.contractEndDate) : undefined

    // Update employee in database
    const updatedEmployee = await prisma.employee.update({
      where: { employeeId: employeeId },
      data: {
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        middleName: employeeData.middleName,
        email: employeeData.email,
        phoneNumber: employeeData.phoneNumber,
        gender: employeeData.gender,
        dateOfBirth: dateOfBirth,
        address: employeeData.address,
        nationalID: employeeData.nationalID,
        departmentId: employeeData.departmentId,
        position: employeeData.position,
        dateOfJoining: dateOfJoining,
        employmentType: employeeData.employmentType as EmploymentType,
        maritalStatus: employeeData.maritalStatus as MaritalStatus,
        emergencyContactName: employeeData.emergencyContactName,
        emergencyContactPhone: employeeData.emergencyContactPhone,
        emergencyContactRelationship: employeeData.emergencyContactRelationship,
        bankName: employeeData.bankName || null,
        bankAccountNumber: employeeData.bankAccountNumber || null,
        bankBranch: employeeData.bankBranch || null,
        taxID: employeeData.taxID || null,
        socialSecurityNumber: employeeData.socialSecurityNumber || null,
        salary: employeeData.salary ? parseFloat(employeeData.salary) : null,
        currency: employeeData.currency as Currency || null,
        isProbation: Boolean(employeeData.isProbation),
        probationEndDate: probationEndDate || null,
        contractEndDate: contractEndDate || null,
        employmentStatus: employeeData.employmentStatus as EmploymentStatus,
        profileImage: employeeData.profileImage || null,
        resumeLink: employeeData.resumeLink || null,
        contractLink: employeeData.contractLink || null,
        identityDocumentLink: employeeData.identityDocumentLink || null,
      },
    })

    return NextResponse.json(updatedEmployee)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to update employee',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
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
      console.error("Error occurred", error)
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
        console.error("Error occurred", error)
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
  
export async function PATCH(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const updateData = await request.json()
    const { employeeId } = params

    const updatedEmployee = await prisma.employee.update({
      where: { employeeId },
      data: updateData,
    })

    return NextResponse.json(updatedEmployee)
  } catch (error) {
    console.error('PATCH Error:', error)
    return NextResponse.json(
      { error: 'Failed to update employee field' },
      { status: 500 }
    )
  }
}
  
  