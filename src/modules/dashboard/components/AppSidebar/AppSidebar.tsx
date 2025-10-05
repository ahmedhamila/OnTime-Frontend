"use client"

import React from "react"

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail
} from "@/components/ui/sidebar"
import { DEFAULT_NAV_ITEMS } from "@/modules/dashboard/constants/sidebar"
import { useSidebarCollapse } from "@/modules/dashboard/hooks/useSidebarCollapse"
import { NavItem } from "@/modules/dashboard/types/sidebar"

import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	navItems?: NavItem[]
}

export function AppSidebar({
	navItems = DEFAULT_NAV_ITEMS,
	...props
}: AppSidebarProps) {
	const { isCollapsed } = useSidebarCollapse()

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="p-3"></SidebarHeader>
			<SidebarContent className="pt-10">
				<NavMain items={navItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
