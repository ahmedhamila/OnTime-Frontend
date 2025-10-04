import { apiAdmin } from "@/helpers/apiHelpers"

export const UserPasswordService = {
	async updatePassword(params: {
		currentPassword: string
		newPassword: string
	}): Promise<void> {
		await apiAdmin.put("/api/users/update-password/", params)
	}
}
