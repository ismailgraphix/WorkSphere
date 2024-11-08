import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import * as jose from 'jose'

// Define protected paths and their allowed roles
const protectedPaths = {
  '/admin': ['ADMIN'],
  '/hr': ['ADMIN', 'HR'],
  '/employee': ['ADMIN', 'HR', 'EMPLOYEE'],
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  // Check if path needs protection
  const isProtectedPath = Object.keys(protectedPaths).some(route => 
    path.startsWith(route)
  )

  if (!isProtectedPath) return NextResponse.next()

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    const userRole = payload.role as string

    // Check role authorization
    const allowedRoles = Object.entries(protectedPaths).find(([route]) => 
      path.startsWith(route)
    )?.[1]

    if (!allowedRoles?.includes(userRole)) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Token invalid/expired
    console.error('Token validation failed:', error);
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/hr/:path*', '/employee/:path*']
} 