import * as z from "zod"

export const accountInfoSchema = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters"),
	lastName: z.string().min(2, "Last name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	phoneNumber: z
		.string()
		.min(10, "Phone number must be at least 10 characters"),
	image: z.instanceof(File).optional()
})

export type AccountInfoValues = z.infer<typeof accountInfoSchema>
