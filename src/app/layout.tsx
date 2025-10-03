import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Providers } from "@/providers"
import { SpeedInsights } from "@vercel/speed-insights/next"
import NextTopLoader from "nextjs-toploader"
import { Toaster } from "sonner"


import "./globals.css"

import { getSession } from "@/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "OnTime",
	description: "OnTime"
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await getSession()
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers session={session}>
					<NextTopLoader
						color="#ff6b00"
						initialPosition={0.08}
						crawlSpeed={200}
						height={3}
						crawl={true}
						showSpinner={true}
						easing="ease"
						speed={200}
						shadow="0 0 10px #ff6b00,0 0 5px #ff6b00"
					/>

					<main className="flex flex-col">{children}</main>
					<SpeedInsights />
				</Providers>
				<Toaster
					richColors={true}
					position="top-right"
					closeButton
					toastOptions={{
						classNames: {
							closeButton: `!self-end m-3 left-[90%]`
						}
					}}
				/>
			</body>
		</html>
	)
}
