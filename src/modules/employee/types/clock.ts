import { Employee } from "./employee"

export interface Clock {
	id: number
	clockType: "in" | "out"
	employee: Employee
	pinCode: string
	locationLat: number
	locationLng: number
	photo: string
	timestamp: string
	createdAt: string
	updatedAt: string
}
