import { useQuery } from "@tanstack/react-query"

import { ClockService } from "../services/ClockService"

export const useClocks = () => {
	return useQuery({
		queryKey: ["clock-records"],
		queryFn: ClockService.getClocks,
		staleTime: 0,
		gcTime: 0,
		refetchOnMount: true,
		refetchOnWindowFocus: true
	})
}
