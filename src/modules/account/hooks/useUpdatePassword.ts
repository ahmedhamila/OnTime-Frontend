import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { UserPasswordService } from "../services/UserPasswordService"

export function useUpdatePassword() {
	return useMutation({
		mutationFn: UserPasswordService.updatePassword,
		onSuccess: () => {
			toast.success("Mot de passe mis à jour avec succès")
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error && "response" in error
					? (error as any).response?.data?.errors[0]?.detail
					: "Erreur lors de la mise à jour du mot de passe"

			toast.error(errorMessage)
		}
	})
}
