import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import {
	EmailLoginFormData,
	emailLoginSchema
} from "../schemas/EmailAuthSchema"
import { useLogin } from "./useEmailLogin"

export const useEmailLoginForm = () => {
	const {
		register,
		handleSubmit,

		formState: { errors }
	} = useForm<EmailLoginFormData>({
		resolver: zodResolver(emailLoginSchema),
		mode: "onChange"
	})

	const loginMutation = useLogin()

	const onSubmit = (data: EmailLoginFormData) => {
		loginMutation.mutate(data)
	}

	return {
		register,
		handleSubmit,
		errors,
		onSubmit,
		loginMutation
	}
}
