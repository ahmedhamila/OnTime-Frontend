export interface BreadcrumbConfig {
	label: string
	href?: string
}

export type PathConfig = Record<string, BreadcrumbConfig>
