import { z } from "zod"

export const EmployeeSchema = z.object({
	firstName: z
		.string()
		.min(1, "First name is required")
		.max(50, "First name must be at most 50 characters"),
	lastName: z
		.string()
		.min(1, "Last name is required")
		.max(50, "Last name must be at most 50 characters"),
	phoneNumber: z
		.string()
		.min(10, "Phone number must be valid")
		.max(15, "Phone number too long"),
	pinCode: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 digits")
})

// Type inferred from schema
export type EmployeeFormData = z.infer<typeof EmployeeSchema>
