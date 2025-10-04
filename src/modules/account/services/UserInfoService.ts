import { apiAdmin } from "@/helpers/apiHelpers"
import { User } from "@/types/user"

export const UserInfoService = {
	async updateUserInfo(params: FormData): Promise<User> {
		const response = await apiAdmin.put("/api/users/update-info/", params, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		})
		return response.data
	}
}
