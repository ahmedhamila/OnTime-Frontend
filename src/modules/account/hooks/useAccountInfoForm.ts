"use client"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import {
	accountInfoSchema,
	type AccountInfoValues
} from "../schemas/AccountInfoSchema"
import { useUpdateUserInfo } from "./useUpdateUserInfo"

export function useAccountInfoForm(defaultValues?: Partial<AccountInfoValues>) {
	const updateUserInfo = useUpdateUserInfo()

	const form = useForm<AccountInfoValues>({
		resolver: zodResolver(accountInfoSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phoneNumber: "",
			image: undefined,
			...defaultValues
		}
	})

	async function onSubmit(data: AccountInfoValues) {
		const formData = new FormData()
		Object.entries(data).forEach(([key, value]) => {
			if (value instanceof File) {
				formData.append(key, value)
			} else if (value !== undefined && value !== null) {
				formData.append(key, String(value))
			}
		})
		await updateUserInfo.mutateAsync(formData)
	}

	return { form, onSubmit, isLoading: updateUserInfo.isPending }
}
