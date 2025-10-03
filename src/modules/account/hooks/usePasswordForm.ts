"use client"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { passwordSchema, PasswordValues } from "../schemas/PasswordSchema"
import { useUpdatePassword } from "./useUpdatePassword"

export function usePasswordForm() {
	const updatePassword = useUpdatePassword()

	const form = useForm<PasswordValues>({
		resolver: zodResolver(passwordSchema),
		mode: "onChange"
	})

	async function onSubmit(data: PasswordValues) {
		await updatePassword.mutateAsync({
			currentPassword: data.currentPassword,
			newPassword: data.newPassword
		})
		form.reset({
			currentPassword: "",
			newPassword: "",
			confirmPassword: ""
		})
	}

	return { form, onSubmit, isLoading: updatePassword.isPending }
}
