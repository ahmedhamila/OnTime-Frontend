import { usePathname } from "next/navigation"

import { PATH_CONFIG } from "../constants/breadcrumb"
import { BreadcrumbConfig } from "../types/breadcrumb"

export const useBreadcrumb = () => {
	const pathname = usePathname()

	const getBreadcrumbs = (): BreadcrumbConfig[] => {
		const paths = pathname.split("/").filter(Boolean)
		const breadcrumbs: BreadcrumbConfig[] = []

		let currentPath = ""

		paths.forEach((path) => {
			currentPath += `/${path}`

			if (PATH_CONFIG[path]) {
				breadcrumbs.push({
					...PATH_CONFIG[path],
					href: PATH_CONFIG[path].href || currentPath
				})
			}
		})

		return breadcrumbs
	}

	return {
		breadcrumbs: getBreadcrumbs()
	}
}
