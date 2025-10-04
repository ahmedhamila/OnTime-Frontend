"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, UserCheck } from "lucide-react"

interface ConfirmationStepProps {
	type: "in" | "out"
	employeeName: string
	onConfirm: () => void
	onBack: () => void
}

export function ConfirmationStep({
	type,
	employeeName,
	onConfirm,
	onBack
}: ConfirmationStepProps) {
	const themeColor = type === "in" ? "var(--clock-in)" : "var(--clock-out)"

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center space-y-3">
				<div className="flex justify-center">
					<div
						className="w-16 h-16 rounded-full flex items-center justify-center"
						style={{ backgroundColor: themeColor }}
					>
						<UserCheck
							className="w-8 h-8"
							style={{
								color:
									type === "in"
										? "var(--clock-in-foreground)"
										: "var(--clock-out-foreground)"
							}}
						/>
					</div>
				</div>
				<h1 className="text-2xl font-bold text-balance">
					Confirmer l&apos;identité
				</h1>
				<p className="text-muted-foreground text-balance">Est-ce vous ?</p>
			</div>

			{/* Employee Info */}
			<Card className="p-8">
				<div className="text-center space-y-4">
					<div className="w-24 h-24 rounded-full bg-muted mx-auto flex items-center justify-center">
						<span className="text-4xl font-bold text-foreground">
							{employeeName
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</span>
					</div>
					<div>
						<h2 className="text-2xl font-bold mb-1">{employeeName}</h2>
						<p className="text-muted-foreground">Employé</p>
					</div>
				</div>
			</Card>

			{/* Actions */}
			<div className="space-y-3">
				<Button
					variant="outline"
					size="lg"
					className="w-full h-14 text-lg font-semibold border-2 bg-transparent"
					style={{
						borderColor: themeColor,
						backgroundColor: themeColor,
						color:
							type === "in"
								? "var(--clock-in-foreground)"
								: "var(--clock-out-foreground)"
					}}
					onClick={onConfirm}
				>
					Oui, c&apos;est moi
				</Button>
				<Button
					variant="outline"
					size="lg"
					className="w-full h-14 border-2 bg-transparent"
					onClick={onBack}
				>
					<ArrowLeft className="w-5 h-5 mr-2" />
					Retour
				</Button>
			</div>
		</div>
	)
}
