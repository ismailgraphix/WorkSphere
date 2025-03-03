import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Make sure to export the handler function
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")

    if (!employeeId) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 })
    }

    // For testing purposes, let's create a mock response if the ID is 'employee-123'
    if (employeeId === "employee-123") {
      return NextResponse.json({
        employee: {
          id: "employee-123",
          firstName: "John",
          lastName: "Doe",
          position: "Software Engineer",
          department: {
            name: "Engineering",
          },
          dateOfJoining: "2023-01-01",
        },
        leaveBalance: {
          annual: 20,
          sick: 10,
          used: 5,
        },
        recentLeaves: [
          {
            id: "1",
            startDate: "2024-03-01",
            endDate: "2024-03-03",
            leaveType: "Annual",
            status: "APPROVED",
          },
          {
            id: "2",
            startDate: "2024-03-15",
            endDate: "2024-03-16",
            leaveType: "Sick",
            status: "PENDING",
          },
        ],
        attendanceRate: 95,
        attendanceData: Array.from({ length: 31 }, (_, i) => {
          const date = new Date()
          date.setDate(i + 1)
          return {
            date: date.toISOString().split("T")[0],
            status: i % 7 === 0 || i % 7 === 6 ? "weekend" : "present",
            checkIn: "09:00 AM",
            checkOut: "05:00 PM",
          }
        }),
        upcomingHolidays: [
          {
            id: "1",
            title: "New Year",
            date: "2024-01-01",
          },
          {
            id: "2",
            title: "Christmas",
            date: "2024-12-25",
          },
        ],
      })
    }

    // If not using mock data, fetch from database
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        department: true,
      },
    })

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Get leave data
    const leaves = await prisma.leave.findMany({
      where: { employeeId },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    // Get attendance data for the current month
    const currentDate = new Date()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const userId = (
      await prisma.user.findUnique({
        where: { employeeId: employee.id },
      })
    )?.id

    const attendance = userId
      ? await prisma.attendance.findMany({
          where: {
            userId,
            date: {
              gte: firstDayOfMonth,
              lte: lastDayOfMonth,
            },
          },
          orderBy: { date: "asc" },
        })
      : []

    // Calculate attendance rate
    const workingDays = getWorkingDaysInMonth(firstDayOfMonth, lastDayOfMonth)
    const daysAttended = attendance.length
    const attendanceRate = workingDays > 0 ? (daysAttended / workingDays) * 100 : 0

    // Format attendance data for chart
    const attendanceData = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
      const dayAttendance = attendance.find(
        (a) =>
          a.date.getDate() === date.getDate() &&
          a.date.getMonth() === date.getMonth() &&
          a.date.getFullYear() === date.getFullYear(),
      )

      return {
        date: date.toISOString().split("T")[0],
        status: dayAttendance ? "present" : isWeekend(date) ? "weekend" : "absent",
        checkIn: dayAttendance?.checkIn ? formatTime(dayAttendance.checkIn) : null,
        checkOut: dayAttendance?.checkOut ? formatTime(dayAttendance.checkOut) : null,
      }
    })

    // Get upcoming holidays
    const upcomingHolidays = await prisma.holiday.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: { date: "asc" },
      take: 3,
    })

    return NextResponse.json({
      employee,
      leaveBalance: {
        annual: 20, // You might want to fetch this from a configuration
        sick: 10,
        used: leaves.filter((l) => l.status === "APPROVED").length,
      },
      recentLeaves: leaves,
      attendanceRate,
      attendanceData,
      upcomingHolidays,
    })
  } catch (error) {
    console.error("Error fetching employee dashboard data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Helper functions
function getWorkingDaysInMonth(startDate: Date, endDate: Date): number {
  let count = 0
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    if (!isWeekend(currentDate)) {
      count++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return count
}

function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6 // 0 is Sunday, 6 is Saturday
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

