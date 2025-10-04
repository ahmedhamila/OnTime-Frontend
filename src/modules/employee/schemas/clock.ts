import { z } from "zod"

export const ClockSchema = z.object({
	clockType: z.enum(["in", "out"], {
		required_error: "Clock type is required"
	}),
	pinCode: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
	locationLat: z.number().min(-90).max(90, "Invalid latitude"),
	locationLng: z.number().min(-180).max(180, "Invalid longitude"),
	photo: z.string().min(1, "Photo is required")
})

// Type inferred from schema
export type ClockFormData = z.infer<typeof ClockSchema>
