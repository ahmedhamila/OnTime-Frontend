import type React from "react"

import AnimatedTemplate from "@/components/shared/AnimatedTemplate"

export default function Template({ children }: { children: React.ReactNode }) {
	return <AnimatedTemplate>{children}</AnimatedTemplate>
}
