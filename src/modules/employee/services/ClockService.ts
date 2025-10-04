import { apiPublic } from "@/helpers/apiHelpers"

import type { ClockFormData } from "../schemas/clock"
import type { Clock } from "../types/clock"

const base64ToFile = (base64String: string, filename: string): File => {
	// Remove data URL prefix if present
	const base64Data = base64String.includes(",")
		? base64String.split(",")[1]
		: base64String

	// Convert base64 to binary
	const binaryString = atob(base64Data)
	const bytes = new Uint8Array(binaryString.length)
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i)
	}

	// Create blob and convert to file
	const blob = new Blob([bytes], { type: "image/jpeg" })
	return new File([blob], filename, { type: "image/jpeg" })
}

export const ClockService = {
	getClocks: async (): Promise<Clock[]> => {
		const response = await apiPublic.get("/api/employees/clock-records/")
		return response.data
	},

	createClock: async (clockData: ClockFormData): Promise<Clock> => {
		const formData = new FormData()
		formData.append("clock_type", clockData.clockType)
		formData.append("pin_code", clockData.pinCode)
		formData.append("location_lat", clockData.locationLat.toString())
		formData.append("location_lng", clockData.locationLng.toString())
		if (clockData.photo) {
			const photoFile = base64ToFile(
				clockData.photo,
				`clock-photo-${Date.now()}.jpg`
			)
			formData.append("photo", photoFile)
		}
		const response = await apiPublic.post("/api/employees/clock-records/", formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		})
		return response.data
	},

	getClockById: async (id: number): Promise<Clock> => {
		const response = await apiPublic.get(`/api/employees/clock-records/${id}/`)
		return response.data
	},

	deleteClock: async (id: number): Promise<void> => {
		await apiPublic.delete(`/api/employees/clock-records/${id}/`)
	}
}
