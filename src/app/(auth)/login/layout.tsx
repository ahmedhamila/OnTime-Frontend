import React from "react"
import type { Metadata } from "next"
import Image from "next/image"

import { Header } from "@/components/shared/header"

export const metadata: Metadata = {
	title: "Login"
}

export default function Layout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<Header />
			<div className="min-h-[calc(100vh-60px)] grid lg:grid-cols-5">
				{/* Left Column */}
				<div className="flex col-span-3 flex-col p-8 mx-auto lg:p-12">
					{children}
				</div>

				{/* Right Column */}
				<div className="hidden col-span-2 lg:block relative overflow-hidden">
					<Image
						src="/images/LOGIN.jpg"
						alt="LOGIN IMG"
						priority
						fill
						sizes="50vw"
						style={{
							objectFit: "cover"
						}}
					/>
				</div>
			</div>
		</>
	)
}
