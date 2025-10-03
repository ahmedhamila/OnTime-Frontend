import { z } from "zod"

export const emailLoginSchema = z.object({
	email: z.string().email("Veuillez entrer un email valide"),
	password: z
		.string()
		.min(8, "Le mot de passe doit contenir au moins 8 caractères")
})

export type EmailLoginFormData = z.infer<typeof emailLoginSchema>
