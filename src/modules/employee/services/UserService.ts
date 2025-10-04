import { apiAdmin, createServerApi } from "@/helpers/apiHelpers"
import { User } from "@/types/user"

export const getCurrentUser = async (): Promise<User> => {
	const { data } = await apiAdmin.post("/api/users/identity/")
	return data
}

export const getCurrentUserServerSide = async (): Promise<User> => {
	const api = await createServerApi()
	const { data } = await apiAdmin.post("/api/users/identity/")
	return data
}
