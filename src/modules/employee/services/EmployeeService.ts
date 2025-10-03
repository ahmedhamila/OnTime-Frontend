import { api } from "@/helpers/apiHelpers"

import { EmployeeFormData } from "../schemas/employee"
import { Employee } from "../types/employee"

export const EmployeeService = {
	getEmployees: async (): Promise<Employee[]> => {
		const response = await api.get("/api/employees/employees/")
		return response.data
	},

	createEmployee: async (employeeData: EmployeeFormData): Promise<Employee> => {
		const response = await api.post("/api/employees/employees/", employeeData)
		return response.data
	},

	updateEmployee: async (
		id: number,
		employeeData: EmployeeFormData
	): Promise<Employee> => {
		const response = await api.put(
			`/api/employees/employees/${id}/`,
			employeeData
		)
		return response.data
	},

	deleteEmployee: async (id: number): Promise<void> => {
		await api.delete(`/api/employees/employees/${id}/`)
	}
}
