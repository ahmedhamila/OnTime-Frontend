import { signIn } from "next-auth/react"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export interface TokenRequest {
	email: string
	password: string
}

export const useLogin = () => {
	return useMutation({
		mutationFn: async (data: TokenRequest) => {
			const result = await signIn("email-login", {
				redirect: false,
				email: data.email,
				password: data.password
			})

			if (!result) {
				throw new Error("Authentication failed")
			}

			if (result.error) {
				throw new Error(result.error)
			}

			if (result.ok) {
				setTimeout(() => {
					signIn("email-login", {
						redirect: true,
						email: data.email,
						password: data.password
					})
				}, 0)
			}

			return result
		},
		onError: (error: Error) => {
			toast.error(error.message)
		},
		onSuccess: () => {
			toast.success("Login Successful")
		}
	})
}
