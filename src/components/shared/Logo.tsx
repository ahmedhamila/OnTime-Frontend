"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"

interface LogoProps {
	isCollapsed?: boolean
}

export function Logo({ isCollapsed = false }: LogoProps) {
	const { theme } = useTheme()

	return (
		<Link href="/dashboard" className="w-fit h-fit">
			<h1>OnTime</h1>
		</Link>
	)
}
