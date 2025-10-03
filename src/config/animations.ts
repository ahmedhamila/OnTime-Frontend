import { Variants } from "framer-motion"

export const pageTransitionVariants: Variants = {
	hidden: { opacity: 0, x: 0, y: 20 },
	enter: { opacity: 1, x: 0, y: 0 },
	exit: { opacity: 0, x: 0, y: -20 }
}

export const pageTransitionConfig = {
	type: "spring" as const,
	stiffness: 260,
	damping: 20
}
