import { getServerSession } from "next-auth"
import { getSession, signOut } from "next-auth/react"

import { authOptions } from "@/auth"
import axios from "axios"

// --- Public client (no auth) ---
export const apiPublic = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	headers: {
		"Content-Type": "application/json"
	}
})

// --- Admin client (with auth interceptor) ---
export const apiAdmin = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	headers: {
		"Content-Type": "application/json"
	}
})

apiAdmin.interceptors.request.use(async (config) => {
	const session = await getSession()
	if (session?.user?.accessToken) {
		config.headers.Authorization = `Bearer ${session.user.accessToken}`
	}
	return config
})

apiAdmin.interceptors.response.use(
	(response) => response,
	async (error) => {
		const prevRequest = error.config
		if (typeof window === "undefined") {
			console.error("API error on server:", error.message)
			return Promise.reject(error)
		}
		if (error.response?.status === 401 && !prevRequest.sent) {
			prevRequest.sent = true
			await signOut({ redirect: true })
		}
		return Promise.reject(error)
	}
)

// --- Server-side Admin API ---
export const createServerApi = async () => {
	const session = await getServerSession(authOptions)
	return axios.create({
		baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
		headers: {
			"Content-Type": "application/json",
			Authorization: session?.user?.accessToken
				? `Bearer ${session.user.accessToken}`
				: ""
		}
	})
}
