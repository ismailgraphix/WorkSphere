import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }

    // Here you can generate a JWT or create a session
    // For simplicity, we'll just return the user data
    return new Response(JSON.stringify({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, role: user.role } }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
};
