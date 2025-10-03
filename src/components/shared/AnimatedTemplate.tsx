"use client"

import type React from "react"

import { AnimatePresence, motion } from "framer-motion"

import {
	pageTransitionConfig,
	pageTransitionVariants
} from "@/config/animations"

export interface AnimatedTemplateProps {
	children: React.ReactNode
}

export default function AnimatedTemplate({ children }: AnimatedTemplateProps) {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				initial="hidden"
				animate="enter"
				exit="exit"
				variants={pageTransitionVariants}
				transition={pageTransitionConfig}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	)
}
