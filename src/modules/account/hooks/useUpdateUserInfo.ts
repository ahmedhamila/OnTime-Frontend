import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { UserInfoService } from "../services/UserInfoService"

export function useUpdateUserInfo() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (formData: FormData) => {
			return UserInfoService.updateUserInfo(formData)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["current-user"] })
			toast.success("Informations mises à jour avec succès")
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error && "response" in error
					? (error as any).response?.data?.errors[0]?.detail
					: "Erreur lors de la mise à jour des informations"

			toast.error(errorMessage)
		}
	})
}
