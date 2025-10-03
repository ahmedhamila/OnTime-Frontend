import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { EmployeeFormData, EmployeeSchema } from "../schemas/employee"
import { Employee } from "../types/employee"
import { useUpdateEmployee } from "./useUpdateEmployee"

export const useUpdateEmployeeForm = (
	onOpenChange: (open: boolean) => void,
	initialData: Employee | undefined
) => {
	const form = useForm({
		resolver: zodResolver(EmployeeSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			phoneNumber: "",
			pinCode: ""
		}
	})

	useEffect(() => {
		if (initialData) {
			form.reset({
				firstName: initialData.firstName,
				lastName: initialData.lastName,
				phoneNumber: initialData.phoneNumber,
				pinCode: initialData.pinCode
			})
		}
	}, [initialData, form.reset, form])

	const updateEmployeeMutation = useUpdateEmployee()

	const handleSubmit = (data: EmployeeFormData) => {
		updateEmployeeMutation.mutate(
			{
				id: initialData?.id ?? 0,
				...data
			},
			{
				onSuccess: () => {
					form.reset()
					onOpenChange(false)
				}
			}
		)
	}

	return {
		form,
		handleSubmit,
		updateEmployeeMutation
	}
}
