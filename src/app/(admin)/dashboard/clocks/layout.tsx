import React from "react"

export default function AccessLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex flex-col ">
			<div className="flex flex-col gap-4">
				<h1 className="text-3xl font-semibold">Pointages</h1>
				{children}
			</div>
		</div>
	)
}
