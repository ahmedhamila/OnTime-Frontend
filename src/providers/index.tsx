"use client"

import React from "react"
import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

import { QueryProvider } from "@/providers/queryProvider"
import { ThemeProvider } from "@/providers/themeProvider"

export function Providers({
	session,
	children
}: {
	session: Session | null
	children: React.ReactNode
}) {
	return (
		<SessionProvider session={session}>
			<ThemeProvider
				attribute="class"
				defaultTheme="light"
				enableSystem
				disableTransitionOnChange
			>
				<QueryProvider>{children}</QueryProvider>
			</ThemeProvider>
		</SessionProvider>
	)
}
