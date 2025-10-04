import { useQuery } from "@tanstack/react-query"

import { EmployeeService } from "../services/EmployeeService"

export const useEmployees = () => {
	return useQuery({
		queryKey: ["employees"],
		queryFn: EmployeeService.getEmployees,
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: true,
		refetchOnWindowFocus: true
	})
}
