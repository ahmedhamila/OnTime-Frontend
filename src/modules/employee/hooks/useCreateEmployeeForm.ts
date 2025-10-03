import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { EmployeeFormData, EmployeeSchema } from "../schemas/employee"
import { useCreateEmployee } from "./useCreateEmployee"

export const useCreateEmployeeForm = (
	onOpenChange: (open: boolean) => void
) => {
	const form = useForm<EmployeeFormData>({
		resolver: zodResolver(EmployeeSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			phoneNumber: "",
			pinCode: ""
		}
	})

	const createEmployeeMutation = useCreateEmployee()

	const handleSubmit = (data: EmployeeFormData) => {
		createEmployeeMutation.mutate(data, {
			onSuccess: () => {
				form.reset()
				onOpenChange(false)
			}
		})
	}

	return {
		form,
		handleSubmit,
		createEmployeeMutation
	}
}
