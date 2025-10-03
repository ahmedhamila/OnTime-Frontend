import { useSidebar } from "@/components/ui/sidebar"

export const useSidebarCollapse = () => {
	const { state } = useSidebar()
	return {
		isCollapsed: state === "collapsed"
	}
}
