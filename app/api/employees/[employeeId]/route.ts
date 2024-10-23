import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Assuming you have Prisma setup
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET(request: NextRequest, { params }: { params: { employeeId: string } }) {
  try {
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

    // Allow only 'ADMIN' or 'HR' roles to access this route
    if (user.role !== 'ADMIN' && user.role !== 'HR') {
      return NextResponse.json({ error: 'Permission denied. Only Admins and HR can access this resource.' }, { status: 403 });
    }

    const { employeeId } = params;

    // Fetch the employee from the database using employeeId
    const employee = await prisma.employee.findUnique({
      where: {
        employeeId: employeeId,
      },
      include: {
        department: true,
      },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
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
      middleName: body.middleName || '', // Optional field
      email: body.email,
      phoneNumber: body.phoneNumber,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      address: body.address,
      nationalID: body.nationalID,
      departmentId: body.departmentId,
      position: body.position,
      dateOfJoining: new Date(body.dateOfJoining), // Ensure this is valid
      employmentType: body.employmentType,
      emergencyContactName: body.emergencyContactName,
      emergencyContactPhone: body.emergencyContactPhone,
      emergencyContactRelationship: body.emergencyContactRelationship,
      maritalStatus: body.maritalStatus, // Added marital status
      
      // Optional Fields
      salary: body.salary ? parseFloat(body.salary) : null,
      currency: body.currency || null,
      isProbation: body.isProbation === 'true', // Boolean field
      probationEndDate: body.probationEndDate ? new Date(body.probationEndDate) : null,
      contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : null,
      employmentStatus: body.employmentStatus || 'ACTIVE', // Default to ACTIVE

      // Optional Bank & Tax Fields
      bankName: body.bankName || null,
      bankAccountNumber: body.bankAccountNumber || null,
      bankBranch: body.bankBranch || null,
      taxID: body.taxID || null,
      socialSecurityNumber: body.socialSecurityNumber || null,

      // Optional Document Links
      profileImage: body.profileImage || null,
      resumeLink: body.resumeLink || null,
      contractLink: body.contractLink || null,
      identityDocumentLink: body.identityDocumentLink || null,
    };

    // Remove properties that are undefined (optional)
    Object.keys(dataToUpdate).forEach((key) => (dataToUpdate[key] === undefined) && delete dataToUpdate[key]);

    // Update the employee in the database
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
  
  