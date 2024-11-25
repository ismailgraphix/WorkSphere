import { cookies } from 'next/headers';
import { NextAuthOptions } from 'next-auth'; // Correct import for NextAuthOptions
import { z } from 'zod';

// Define session type
interface UserSession {
  user: {
    id: string;
    // Add other user properties as needed
  };
}

// Define cookie store type
type CookieStore = ReturnType<typeof cookies>;

export const authOptions: NextAuthOptions = {
  providers: [
    // Your providers configuration (e.g., GitHub, Google, etc.)
  ],
  callbacks: {
    // Your callbacks configuration
  },
  pages: {
    signIn: '/login',
    // Other custom pages if needed
  },
  // Other options as needed
};

export async function getSession(cookieStore: CookieStore): Promise<UserSession | null> {
  const sessionToken = cookieStore.get('session');
  if (!sessionToken) {
    return null;
  }

  // Validate the session token format using zod
  const sessionSchema = z.object({
    user: z.object({
      id: z.string(),
    }),
  });

  try {
    // Parse and validate session data
    const sessionData = JSON.parse(sessionToken.value!);
    return sessionSchema.parse(sessionData);
  } catch (error) {
    console.error('Invalid session format:', error);
    return null;
  }
}
