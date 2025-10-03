import { getCurrentUser } from "@/modules/employee/services/UserService"
import { useQuery } from "@tanstack/react-query"
import { User } from "@/types/user"

export const useCurrentUser = () => {
	return useQuery<User, Error>({
		queryKey: ["current-user"],
		queryFn: getCurrentUser,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 5, // 5 minutes
		retry: 1
	})
}
