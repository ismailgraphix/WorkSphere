import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';  // Make sure to store your secret securely

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
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
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
      { expiresIn: '1h' }  // The token will expire in 1 hour
    );

    // Return the token along with the user info
    return new Response(
      JSON.stringify({
        message: 'Login successful',
        token,  // Send the generated JWT token
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
};
