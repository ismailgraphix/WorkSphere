import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PUT(
  request: Request,
  { }: { params: { employeeId: string } }
) {
  try {
    const { status, leaveId, rejectionReason } = await request.json()

    if (!leaveId) {
      return NextResponse.json(
        { error: "Leave ID is required" },
        { status: 400 }
      )
    }
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      status,
      updatedAt: new Date(),
    }

    if (status === 'REJECTED' && rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }

    const updatedLeave = await prisma.leave.update({
      where: {
        id: leaveId
      },
      data: updateData,
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