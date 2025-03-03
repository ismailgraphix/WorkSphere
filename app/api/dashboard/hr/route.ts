import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [employees, leaveRequests, openJobs, recentApplications] = await Promise.all([
      prisma.employee.count(),
      prisma.leave.count({ where: { status: "PENDING" } }),
      prisma.job.count({ where: { status: "OPEN" } }),
      prisma.application.findMany({
        take: 5,
        orderBy: { appliedAt: "desc" },
        include: {
          job: {
            select: { title: true },
          },
          user: {
            select: { name: true },
          },
        },
      }),
    ])

    // Get monthly leave data for chart
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()

    const leaveData = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const month = (currentMonth - i + 12) % 12
        const year = currentMonth - i < 0 ? currentYear - 1 : currentYear

        return prisma.leave
          .groupBy({
            by: ["leaveType"],
            where: {
              startDate: {
                gte: new Date(year, month, 1),
                lt: new Date(year, month + 1, 1),
              },
            },
            _count: true,
          })
          .then((result) => {
            return {
              month: new Date(year, month, 1).toLocaleString("default", { month: "short" }),
              sick: result.find((r) => r.leaveType === "SICK")?._count || 0,
              vacation: result.find((r) => r.leaveType === "VACATION")?._count || 0,
              personal: result.find((r) => r.leaveType === "PERSONAL")?._count || 0,
            }
          })
      }),
    )

    return NextResponse.json({
      totalEmployees: employees,
      pendingLeaveRequests: leaveRequests,
      openJobs: openJobs,
      recentApplications,
      leaveData: leaveData.reverse(), // Most recent month last
    })
  } catch (error) {
    console.error("Error fetching HR dashboard data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

