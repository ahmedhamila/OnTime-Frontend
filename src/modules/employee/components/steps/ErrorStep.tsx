"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorStepProps {
	type: "in" | "out"
	errorMessage?: string
}

export function ErrorStep({ type, errorMessage }: ErrorStepProps) {
	return (
		<div className="text-center space-y-6 animate-in fade-in-50 duration-500">
			<div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
				<AlertCircle className="w-10 h-10 text-destructive" />
			</div>

			<div className="space-y-2">
				<h2 className="text-2xl font-bold text-foreground">
					Clock {type === "in" ? "In" : "Out"} Failed
				</h2>
				<p className="text-muted-foreground">
					{errorMessage ||
						"Something went wrong while processing your request."}
				</p>
			</div>
		</div>
	)
}
