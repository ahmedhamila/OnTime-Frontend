"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Delete, Lock } from "lucide-react"

interface PinStepProps {
	type: "in" | "out"
	onSubmit: (pin: string) => void
	isLoading?: boolean
}

export function PinStep({ type, onSubmit, isLoading = false }: PinStepProps) {
	const [pin, setPin] = useState("")
	const themeColor = type === "in" ? "var(--clock-in)" : "var(--clock-out)"

	const handleNumberClick = (num: string) => {
		if (pin.length < 4 && !isLoading) {
			setPin(pin + num)
		}
	}

	const handleDelete = () => {
		if (!isLoading) {
			setPin(pin.slice(0, -1))
		}
	}

	const handleSubmit = () => {
		if (pin.length === 4 && !isLoading) {
			onSubmit(pin)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isLoading) {
			const value = e.target.value.replace(/\D/g, "").slice(0, 4)
			setPin(value)
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center space-y-3">
				<div className="flex justify-center">
					<div
						className="w-16 h-16 rounded-full flex items-center justify-center"
						style={{ backgroundColor: themeColor }}
					>
						<Lock
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
					Pointage {type === "in" ? "Entrée" : "Sortie"}
				</h1>
				<p className="text-muted-foreground text-balance">
					{isLoading
						? "Vérification du code PIN..."
						: "Entrez votre code PIN à 4 chiffres"}
				</p>
			</div>

			{/* PIN Display */}
			<Card className="p-8">
				<div className="mb-6">
					<Input
						type="tel"
						inputMode="numeric"
						maxLength={4}
						value={pin}
						onChange={handleInputChange}
						placeholder="Enter PIN"
						className="text-center text-2xl font-bold h-14 tracking-widest"
						disabled={isLoading}
					/>
				</div>

				<div className="flex justify-center gap-3 mb-6">
					{[0, 1, 2, 3].map((i) => (
						<div
							key={i}
							className="w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold"
							style={{
								borderColor: pin.length > i ? themeColor : "var(--border)",
								backgroundColor: pin.length > i ? themeColor : "transparent",
								color:
									pin.length > i
										? type === "in"
											? "var(--clock-in-foreground)"
											: "var(--clock-out-foreground)"
										: "var(--muted-foreground)"
							}}
						>
							{pin[i] ? "•" : ""}
						</div>
					))}
				</div>

				{/* Number Pad */}
				<div className="grid grid-cols-3 gap-3">
					{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
						<Button
							key={num}
							variant="outline"
							size="lg"
							className="h-16 text-xl font-semibold hover:bg-accent bg-transparent"
							onClick={() => handleNumberClick(num.toString())}
							disabled={isLoading}
						>
							{num}
						</Button>
					))}
					<Button
						variant="outline"
						size="lg"
						className="h-16 hover:bg-accent bg-transparent"
						onClick={handleDelete}
						disabled={pin.length === 0 || isLoading}
					>
						<Delete className="w-5 h-5" />
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="h-16 text-xl font-semibold hover:bg-accent bg-transparent"
						onClick={() => handleNumberClick("0")}
						disabled={isLoading}
					>
						0
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="h-16 text-lg font-semibold border-2 bg-transparent"
						style={{
							borderColor: pin.length === 4 ? themeColor : "var(--border)",
							backgroundColor: pin.length === 4 ? themeColor : "transparent",
							color:
								pin.length === 4
									? type === "in"
										? "var(--clock-in-foreground)"
										: "var(--clock-out-foreground)"
									: "var(--muted-foreground)"
						}}
						onClick={handleSubmit}
						disabled={pin.length !== 4 || isLoading}
					>
						{isLoading ? (
							<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
						) : (
							"→"
						)}
					</Button>
				</div>
			</Card>
		</div>
	)
}
