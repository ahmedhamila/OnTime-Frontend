"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"

import * as NProgress from "nprogress"

export function useNavigate() {
	const router = useRouter()

	const push = useCallback(
		(path: string) => {
			NProgress.start()
			router.push(path)
		},
		[router]
	)

	const back = useCallback(() => {
		NProgress.start()
		router.back()
	}, [router])

	const forward = useCallback(() => {
		NProgress.start()
		router.forward()
	}, [router])

	const refresh = useCallback(() => {
		NProgress.start()
		router.refresh()
	}, [router])

	return {
		push,
		back,
		forward,
		refresh,
		router
	}
}
