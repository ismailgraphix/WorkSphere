import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';  // Store your secret securely in env variables

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1h' }  // Token expiration (1 hour)
    );

    // Set the token in an HTTP-only cookie
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`
    );

    // Return success response with the user information (without token in body)
    return new Response(
      JSON.stringify({
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
};
