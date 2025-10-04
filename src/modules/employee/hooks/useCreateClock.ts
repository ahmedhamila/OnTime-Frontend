import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import type { ClockFormData } from "../schemas/clock"
import { ClockService } from "../services/ClockService"

export const useCreateClock = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (clockData: ClockFormData) =>
			ClockService.createClock(clockData),
		onSuccess: (newClock) => {
			queryClient.invalidateQueries({ queryKey: ["clock-records"] })
			toast.success(
				`Successfully clocked ${newClock.clockType === "in" ? "in" : "out"}!`
			)
		},
		onError: (error) => {
			const errorMessage =
				error instanceof Error && "response" in error
					? (error as any).response?.data?.errors[0]?.detail
					: "Failed to clock in/out"
			toast.error(errorMessage)
		}
	})
}
