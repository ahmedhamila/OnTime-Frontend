import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { EmployeeService } from "../services/EmployeeService"

export const useDeleteEmployee = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => EmployeeService.deleteEmployee(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["employees"] })
			toast.success("Employé supprimé avec succès")
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error && "response" in error
					? (error as any).response?.data?.errors[0]?.detail
					: "Échec de la suppression de l'employé"
			toast.error(errorMessage)
		}
	})
}
