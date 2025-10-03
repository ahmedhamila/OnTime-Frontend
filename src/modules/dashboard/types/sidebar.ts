import { ReactElement } from "react"

import { LucideIcon } from "lucide-react"

export interface NavItem {
	title: string
	url: string
	icon: ReactElement<LucideIcon>
	isActive?: boolean
}
