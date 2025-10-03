import React from "react"
import type { Metadata } from "next"

import { Header } from "@/components/shared/header"

export const metadata: Metadata = {
	title: "Clock Out"
}

export default function Layout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<Header />
			<div className="min-h-[calc(100vh-60px)] flex flex-col">{children}</div>
		</>
	)
}
