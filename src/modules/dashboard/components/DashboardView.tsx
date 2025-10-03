"use client"

import { useSession } from "next-auth/react"


export default function DashboardView() {
	const { data: session } = useSession()

	return (
		<div className="flex flex-col gap-6 p-4 md:p-6">
			<p>aaaa</p>
		</div>
	)
}
