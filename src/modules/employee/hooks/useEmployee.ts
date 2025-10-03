import { useQuery } from "@tanstack/react-query"
import { EmployeeService } from "../services/EmployeeService"


export const useEmployees = () => {
	return useQuery({
		queryKey: ["employees"],
		queryFn: EmployeeService.getEmployees,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 5 // 5 minutes
	})
}
