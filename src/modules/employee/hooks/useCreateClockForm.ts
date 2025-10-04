import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { ClockSchema, type ClockFormData } from "../schemas/clock"
import { useCreateClock } from "./useCreateClock"

export const useCreateClockForm = (callbacks?: {
	onSuccess?: () => void
	onError?: (error: Error) => void
}) => {
	const form = useForm<ClockFormData>({
		resolver: zodResolver(ClockSchema),
		defaultValues: {
			clockType: "in",
			pinCode: "",
			locationLat: 0,
			locationLng: 0,
			photo: ""
		}
	})

	const createClockMutation = useCreateClock()

	const handleSubmit = (data: ClockFormData) => {
		createClockMutation.mutate(data, {
			onSuccess: () => {
				form.reset()
				callbacks?.onSuccess?.()
			},
			onError: (error) => {
				callbacks?.onError?.(error as Error)
			}
		})
	}

	return {
		form,
		handleSubmit,
		createClockMutation
	}
}
