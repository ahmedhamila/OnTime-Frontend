import { Clock, LayoutDashboard, UserCog } from "lucide-react"

import { NavItem } from "../types/sidebar"

export const DEFAULT_NAV_ITEMS: NavItem[] = [
	{
		title: "Pointages",
		url: "/dashboard/clocks",
		icon: <Clock className="!w-6 !h-6" />
	},
	{
		title: "Employés",
		url: "/dashboard/employee",
		icon: <UserCog className="!w-6 !h-6" />
	}
]
