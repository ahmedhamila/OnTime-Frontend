import type React from "react"
import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { authOptions } from "@/auth"
import { Theme } from "@/components/shared/theme"
import { Separator } from "@/components/ui/separator"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from "@/components/ui/sidebar"
import { getCurrentUserServerSide } from "@/modules/employee/services/UserService"
import { AppSidebar } from "@/modules/dashboard/components/AppSidebar/AppSidebar"
import { DashboardBreadcrumb } from "@/modules/dashboard/components/DashboardBreadcrumb"
import {
	dehydrate,
	HydrationBoundary,
	QueryClient
} from "@tanstack/react-query"

export const metadata: Metadata = {
	title: "Dashboard"
}

export default async function Layout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect("/login")
	}

	const queryClient = new QueryClient()

	try {
		await queryClient.prefetchQuery({
			queryKey: ["current-user"],
			queryFn: getCurrentUserServerSide
		})
	} catch (error) {
		console.error("Failed to fetch user:", error)
		redirect("/login")
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SidebarProvider>
				<div className="flex min-h-screen w-full overflow-hidden">
					<AppSidebar />
					<SidebarInset className="flex w-[calc(100vw-250px)] flex-col">
						<div className="sticky top-0 z-50">
							<header className="flex h-16 shrink-0 items-center justify-between border-b bg-background/60 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
								<div className="flex items-center gap-2">
									<SidebarTrigger className="-ml-1" />
									<Separator orientation="vertical" className="mr-2 h-4" />
									<DashboardBreadcrumb />
								</div>
								<div className="flex gap-4">
									<Theme />
								</div>
							</header>
						</div>
						<main className="h-[calc(100vh-4rem)] overflow-auto ">
							<div className="flex flex-col gap-4 p-4 max-w-full">
								{children}
							</div>
						</main>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</HydrationBoundary>
	)
}
