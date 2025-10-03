import { api } from "@/helpers/apiHelpers"

export const UserPasswordService = {
	async updatePassword(params: {
		currentPassword: string
		newPassword: string
	}): Promise<void> {
		await api.put("/api/users/update-password/", params)
	}
}
