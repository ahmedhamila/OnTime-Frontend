import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { EmployeeFormData } from "../schemas/employee"
import { EmployeeService } from "../services/EmployeeService"

export const useCreateEmployee = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (employeeData: EmployeeFormData) =>
			EmployeeService.createEmployee(employeeData),
		onSuccess: (newEmployee) => {
			queryClient.invalidateQueries({ queryKey: ["employees"] })
			toast.success("Employee added successfully")
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error && "response" in error
					? (error as any).response?.data?.errors[0]?.detail
					: "Failed to add Employee"
			toast.error(errorMessage)
		}
	})
}
