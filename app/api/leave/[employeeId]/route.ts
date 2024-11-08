import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PUT(
  request: Request,
  { params }: { params: { employeeId: string } }
) {
  try {
    const { employeeId } = params
    const { status, leaveId } = await request.json()

    if (!leaveId) {
      return NextResponse.json(
        { error: "Leave ID is required" },
        { status: 400 }
      )
    }

    const updatedLeave = await prisma.leave.update({
      where: {
        id: leaveId
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedLeave)
  } catch (error) {
    console.error('Error updating leave application:', error)
    return NextResponse.json(
      { error: "Error updating leave application" },
      { status: 500 }
    )
  }
}