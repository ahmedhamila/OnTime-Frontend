"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Lock, User2 } from "lucide-react"

interface AccountLayoutProps {
	children: React.ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
	const pathname = usePathname()

	return (
		<div className="container mx-auto py-8">
			<div className="space-y-6">
				<div className="space-y-0.5">
					<h1 className="text-2xl font-bold tracking-tight">
						Paramètres du compte
					</h1>
					<p className="text-muted-foreground">
						Modifier les informations et les paramètres du compte
					</p>
				</div>
				<Separator className="my-6" />
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className="lg:w-1/5">
						<nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
							<Link
								href="/dashboard/account/info"
								className={cn(
									"flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
									pathname === "/dashboard/account/info"
										? "bg-accent"
										: "transparent"
								)}
							>
								<User2 className="h-4 w-4" />
								Informations du base
							</Link>
							<Link
								href="/dashboard/account/password"
								className={cn(
									"flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
									pathname === "/dashboard/account/password"
										? "bg-accent"
										: "transparent"
								)}
							>
								<Lock className="h-4 w-4" />
								Mot de passe
							</Link>
						</nav>
					</aside>
					<Separator orientation="vertical" className="hidden lg:block" />
					<main className="flex-1 lg:max-w-2xl">
						<div className="space-y-6">{children}</div>
					</main>
				</div>
			</div>
		</div>
	)
}
