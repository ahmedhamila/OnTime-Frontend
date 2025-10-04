import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { EmployeeService } from "../services/EmployeeService"
import { Employee } from "../types/employee"

export const useEmployeeByPin = () => {
	return useMutation<Employee, Error, string>({
		mutationFn: (pinCode: string) => EmployeeService.getEmployeeByPin(pinCode),
		onError: (error) => {
			const errorMessage =
				error instanceof Error && "response" in error
					? (error as any).response?.data?.errors?.[0]?.detail
					: "Employee not found with this PIN"
			toast.error(errorMessage)
		}
	})
}
