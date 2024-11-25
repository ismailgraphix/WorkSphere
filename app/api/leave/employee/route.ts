import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    // Get the user session
    const cookieStore = cookies()
    const session = await getSession(cookieStore)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get employee ID from the session user
    const userId = session.user.id

    // First get the employee details
    const employee = await prisma.employee.findFirst({
      where: {
        id: userId,
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      )
    }

    // Then fetch all leaves for this employee
    const leaves = await prisma.leave.findMany({
      where: {
        employeeId: employee.id
      },
      include: {
        department: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(leaves)

  } catch (error) {
    console.error('Error fetching employee leaves:', error)
    return NextResponse.json(
      { error: "Failed to fetch leave applications" },
      { status: 500 }
    )
  }
}