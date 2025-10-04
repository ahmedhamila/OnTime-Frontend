"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"

interface SuccessStepProps {
	type: "in" | "out"
	employeeName: string
}

export function SuccessStep({ type, employeeName }: SuccessStepProps) {
	const themeColor = type === "in" ? "var(--clock-in)" : "var(--clock-out)"
	const timestamp = new Date().toLocaleString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	})

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			{/* Success Icon */}
			<div className="text-center space-y-4">
				<div className="flex justify-center">
					<div
						className="w-24 h-24 rounded-full flex items-center justify-center animate-in zoom-in duration-500"
						style={{ backgroundColor: themeColor }}
					>
						<CheckCircle
							className="w-14 h-14"
							style={{
								color:
									type === "in"
										? "var(--clock-in-foreground)"
										: "var(--clock-out-foreground)"
							}}
						/>
					</div>
				</div>
				<div>
					<h1 className="text-3xl font-bold mb-2 text-balance">
						Clocked {type === "in" ? "In" : "Out"}!
					</h1>
					<p className="text-lg text-muted-foreground text-balance">
						{type === "in" ? "Have a great shift" : "See you next time"},{" "}
						{employeeName.split(" ")[0]}
					</p>
				</div>
			</div>

			{/* Details Card */}
			<Card className="p-6">
				<div className="space-y-4">
					<div className="flex items-center justify-between pb-4 border-b border-border">
						<span className="text-muted-foreground">Employee</span>
						<span className="font-semibold">{employeeName}</span>
					</div>
					<div className="flex items-center justify-between pb-4 border-b border-border">
						<span className="text-muted-foreground">Action</span>
						<span className="font-semibold" style={{ color: themeColor }}>
							Clock {type === "in" ? "In" : "Out"}
						</span>
					</div>
					<div className="flex items-start justify-between">
						<span className="text-muted-foreground">Time</span>
						<div className="text-right">
							<div className="font-semibold flex items-center gap-2">
								<Clock className="w-4 h-4" />
								{new Date().toLocaleTimeString("en-US", {
									hour: "2-digit",
									minute: "2-digit"
								})}
							</div>
							<div className="text-sm text-muted-foreground mt-1">
								{new Date().toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric"
								})}
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
