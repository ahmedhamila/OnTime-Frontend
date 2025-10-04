import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { EmployeeFormData } from "../schemas/employee"
import { EmployeeService } from "../services/EmployeeService"

export const useUpdateEmployee = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, ...employeeData }: EmployeeFormData & { id: number }) =>
			EmployeeService.updateEmployee(id, employeeData),
		onSuccess: (updatedEmployee) => {
			queryClient.invalidateQueries({ queryKey: ["employees"] })
			toast.success("Employé mis à jour avec succès")
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error && "response" in error
					? (error as any).response?.data?.errors[0]?.detail
					: "Échec de la mise à jour de l'employé"

			toast.error(errorMessage)
		}
	})
}
