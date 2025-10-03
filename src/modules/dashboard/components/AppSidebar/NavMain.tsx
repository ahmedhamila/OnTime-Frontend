"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

import { useCurrentUser } from "@/hooks/useCurrentUser"

import type { NavItem } from "../../types/sidebar"

export function NavMain({ items }: { items: NavItem[] }) {
	const { data: currentUser, isLoading: isUserLoading } = useCurrentUser()
	const pathname = usePathname()

	if (isUserLoading || !currentUser) {
		return (
			<SidebarGroup>
				<SidebarMenu className="flex flex-col gap-2">
					{items.map((_, index) => (
						<SidebarMenuItem key={index}>
							<SidebarMenuSkeleton showIcon />
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroup>
		)
	}

	return (
		<SidebarGroup>
			<SidebarMenu className="flex flex-col gap-2">
				{items.map((item) => {
					const isExactMatch = pathname === item.url // Exact match check
					const isActive =
						item.url === "/dashboard"
							? isExactMatch
							: pathname.startsWith(item.url)

					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								isActive={isActive}
								tooltip={item.title}
								className={cn(
									"p-6 transition-colors duration-200",
									isActive
										? "bg-sidebar-accent text-sidebar-accent-foreground"
										: "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
								)}
							>
								<Link href={item.url} className="flex items-center gap-3">
									{item.icon && (
										<span
											className={cn(
												isActive
													? "text-sidebar-accent-foreground"
													: "text-sidebar-foreground"
											)}
										>
											{item.icon}
										</span>
									)}
									<span className="font-medium text-lg">{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					)
				})}
			</SidebarMenu>
		</SidebarGroup>
	)
}
