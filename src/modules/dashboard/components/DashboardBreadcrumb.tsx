"use client"

import React from "react"

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

import { useBreadcrumb } from "../hooks/useBreadcrumb"

export const DashboardBreadcrumb = () => {
	const { breadcrumbs } = useBreadcrumb()

	if (breadcrumbs.length === 0) return null

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((crumb, index) => (
					<React.Fragment key={index}>
						<BreadcrumbItem className="hidden md:block text-base  hover:text-primary">
							{index === breadcrumbs.length - 1 ? (
								<BreadcrumbPage className="text-secondary font-bold">
									{crumb.label}
								</BreadcrumbPage>
							) : (
								<BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
							)}
						</BreadcrumbItem>
						{index < breadcrumbs.length - 1 && (
							<BreadcrumbSeparator className="hidden md:block" />
						)}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
