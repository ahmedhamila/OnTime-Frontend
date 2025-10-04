import { apiAdmin, apiPublic } from "@/helpers/apiHelpers"

import { EmployeeFormData } from "../schemas/employee"
import { Employee } from "../types/employee"

export const EmployeeService = {
	getEmployees: async (): Promise<Employee[]> => {
		const response = await apiAdmin.get("/api/employees/employees/")
		return response.data
	},

	createEmployee: async (employeeData: EmployeeFormData): Promise<Employee> => {
		const response = await apiAdmin.post("/api/employees/employees/", employeeData)
		return response.data
	},

	updateEmployee: async (
		id: number,
		employeeData: EmployeeFormData
	): Promise<Employee> => {
		const response = await apiAdmin.put(
			`/api/employees/employees/${id}/`,
			employeeData
		)
		return response.data
	},

	deleteEmployee: async (id: number): Promise<void> => {
		await apiAdmin.delete(`/api/employees/employees/${id}/`)
	},
	getEmployeeByPin: async (pinCode: string): Promise<Employee> => {
		const response = await apiPublic.post("/api/employees/employees/by-pin/", {
			pinCode
		})
		return response.data
	}
}
