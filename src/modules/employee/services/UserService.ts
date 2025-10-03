import { api, createServerApi } from "@/helpers/apiHelpers"
import { User } from "@/types/user"

export const getCurrentUser = async (): Promise<User> => {
	const { data } = await api.post("/api/users/identity/")
	return data
}

export const getCurrentUserServerSide = async (): Promise<User> => {
	const api = await createServerApi()
	const { data } = await api.post("/api/users/identity/")
	return data
}
