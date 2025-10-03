"use client"

import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react"

import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useNavigate } from "@/hooks/useNavigate"

export function NavUser() {
	const { isMobile } = useSidebar()
	const { push } = useNavigate()
	const { data: userEntry, isLoading, error } = useCurrentUser()

	const handleLogout = async () => {
		await signOut({ redirect: true })
		push("/login")
	}

	if (isLoading) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg">
						<Skeleton className="h-8 w-8 rounded-lg" />
						<div className="grid flex-1 gap-1">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-3 w-32" />
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		)
	}

	if (error || !userEntry) {
		return <div>Error loading user</div>
	}

	const user = userEntry

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="relative h-8 w-8 overflow-hidden rounded-lg">
								<Image
									priority
									src={user.image || "/placeholder.svg"}
									alt={user.firstName}
									fill
									sizes="32px"
									className="object-cover"
								/>
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{user.firstName + " " + user.lastName}
								</span>
								<span className="truncate text-xs">{user.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<div className="relative h-8 w-8 overflow-hidden rounded-lg">
									<Image
										priority
										src={user.image || "/placeholder.svg"}
										alt={user.firstName}
										fill
										sizes="32px"
										className="object-cover"
									/>
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{user.firstName + " " + user.lastName}
									</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link
									href="/dashboard/account/info"
									className="cursor-pointer flex gap-3"
								>
									<BadgeCheck />
									Account
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="cursor-pointer flex gap-3"
							onClick={handleLogout}
						>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
