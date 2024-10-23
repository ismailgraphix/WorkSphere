import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Assuming you have Prisma setup
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();

    // Validation
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phoneNumber', 'gender', 'dateOfBirth',
      'address', 'nationalID', 'departmentId', 'position', 'dateOfJoining',
      'employmentType', 'emergencyContactName', 'emergencyContactPhone',
      'emergencyContactRelationship', 'maritalStatus' // Include maritalStatus in required fields
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required.` }, { status: 400 });
      }
    }

    // Auto-generate employeeId
    const employeeId = `${body.firstName.slice(0, 3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

    // Parse salary as float
    const salary = body.salary ? parseFloat(body.salary) : null;

    // Create employee in the database using Prisma
    const employee = await prisma.employee.create({
      data: {
        employeeId, // Use the generated employeeId
        firstName: body.firstName,
        lastName: body.lastName,
        middleName: body.middleName || '', // Optional field
        email: body.email,
        phoneNumber: body.phoneNumber,
        gender: body.gender,
        dateOfBirth: new Date(body.dateOfBirth),
        address: body.address,
        nationalID: body.nationalID,
        departmentId: body.departmentId,
        position: body.position,
        dateOfJoining: new Date(body.dateOfJoining),
        employmentType: body.employmentType,
        emergencyContactName: body.emergencyContactName,
        emergencyContactPhone: body.emergencyContactPhone,
        emergencyContactRelationship: body.emergencyContactRelationship,
        bankName: body.bankName || null, // Optional field
        bankAccountNumber: body.bankAccountNumber || null, // Optional field
        bankBranch: body.bankBranch || null, // Optional field
        taxID: body.taxID || null, // Optional field
        socialSecurityNumber: body.socialSecurityNumber || null, // Optional field
        salary, // Use the parsed salary
        currency: body.currency || null, // Optional field
        isProbation: body.isProbation === 'true', // Boolean field
        probationEndDate: body.probationEndDate ? new Date(body.probationEndDate) : null, // Optional date
        contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : null, // Optional date
        employmentStatus: body.employmentStatus || 'ACTIVE', // Default to ACTIVE
        profileImage: body.profileImage || null, // Optional field
        resumeLink: body.resumeLink || null, // Optional field
        contractLink: body.contractLink || null, // Optional field
        identityDocumentLink: body.identityDocumentLink || null, // Optional field
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
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

    // Fetch all employees from the database
    const employees = await prisma.employee.findMany({
      include: {
        department: true, 
      },
    });

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
