import { NextApiRequest, NextApiResponse } from "next";
import {prisma} from "@/lib/db"; // Adjust the import based on your project structure
import { z } from "zod";

// Define the schema for incoming employee registration data
const employeeSchema = z.object({
  employeeId: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  email: z.string().email(),
  phoneNumber: z.string(),
  gender: z.string(),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date))), // Validates date format
  address: z.string(),
  nationalID: z.string(),
  departmentId: z.string(),
  position: z.string(),
  dateOfJoining: z.string().refine((date) => !isNaN(Date.parse(date))),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED"]),
  emergencyContactName: z.string(),
  emergencyContactPhone: z.string(),
  emergencyContactRelationship: z.string(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankBranch: z.string().optional(),
  taxID: z.string().optional(),
  socialSecurityNumber: z.string().optional(),
  salary: z.number().optional(),
  currency: z.enum(["NGN", "USD", "EUR"]).optional(),
  isProbation: z.boolean().optional(),
  probationEndDate: z.string().optional(),
  contractEndDate: z.string().optional(),
  profileImage: z.string().optional(),
  resumeLink: z.string().optional(),
  contractLink: z.string().optional(),
  identityDocumentLink: z.string().optional(),
});

// Define the API route handler
export default async function registerEmployee(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Validate the incoming request body
      const employeeData = employeeSchema.parse(req.body);

      // Create the employee record in the database
      const newEmployee = await prisma.employee.create({
        data: {
          ...employeeData,
          dateOfBirth: new Date(employeeData.dateOfBirth),
          dateOfJoining: new Date(employeeData.dateOfJoining),
        },
      });

      // Respond with the created employee data
      res.status(201).json(newEmployee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating employee:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Method Not Allowed
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
