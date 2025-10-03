import * as z from "zod"

export const passwordSchema = z
	.object({
		currentPassword: z
			.string()
			.min(8, "Password must be at least 8 characters"),
		newPassword: z
			.string()
			.min(8, {
				message: "Le mot de passe doit contenir au moins 8 caractères"
			})
			.regex(/[A-Z]/, {
				message: "Le mot de passe doit contenir au moins une majuscule"
			})
			.regex(/[a-z]/, {
				message: "Le mot de passe doit contenir au moins une minuscule"
			})
			.regex(/[0-9]/, {
				message: "Le mot de passe doit contenir au moins un chiffre"
			}),
		confirmPassword: z.string()
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"]
	})
export type PasswordValues = z.infer<typeof passwordSchema>
