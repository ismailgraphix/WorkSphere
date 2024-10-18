import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Assuming you have Prisma setup
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function PUT(request: NextRequest, { params }: { params: { employeeId: string } }) {
  try {
    const { employeeId } = params;
    console.log('Employee ID from URL:', employeeId);

    const cookies = request.headers.get('cookie');
    const token = cookies?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      console.log('No token found');
      return NextResponse.json({ error: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    let user;
    try {
      user = jwt.verify(token, JWT_SECRET);
      console.log('Decoded user from token:', user);
    } catch (error) {
      console.log('Invalid token:', error);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);

    // Prepare the data for updating, only including defined values
    const dataToUpdate: any = {
      firstName: body.firstName,
      lastName: body.lastName,
      middleName: body.middleName || '',
      email: body.email,
      phoneNumber: body.phoneNumber,
      gender: body.gender || undefined,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined, // Check if dateOfBirth is defined
      address: body.address || undefined,
      nationalID: body.nationalID || undefined,
      departmentId: body.departmentId,
      position: body.position,
      dateOfJoining: new Date(body.dateOfJoining), // Ensure this is valid
      employmentType: body.employmentType || undefined,
      emergencyContactName: body.emergencyContactName || undefined,
      emergencyContactPhone: body.emergencyContactPhone || undefined,
      emergencyContactRelationship: body.emergencyContactRelationship || undefined,
      salary: body.salary ? parseFloat(body.salary) : null,
      currency: body.currency || null,
      employmentStatus: body.employmentStatus || 'ACTIVE',
      isProbation: body.isProbation === 'true',
      probationEndDate: body.probationEndDate ? new Date(body.probationEndDate) : null,
      contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : null,
      maritalStatus: body.maritalStatus || undefined,
    };

    // Remove properties that are undefined (optional)
    Object.keys(dataToUpdate).forEach(key => (dataToUpdate[key] === undefined) && delete dataToUpdate[key]);

    const updatedEmployee = await prisma.employee.update({
      where: { employeeId },
      data: dataToUpdate,
    });

    console.log('Updated employee:', updatedEmployee);
    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
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
  
  