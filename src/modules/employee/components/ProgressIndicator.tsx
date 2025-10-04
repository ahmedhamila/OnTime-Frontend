import { Theme } from "@/components/shared/theme"

interface ProgressIndicatorProps {
	currentStep: number
	totalSteps: number
	type: "in" | "out"
}

export function ProgressIndicator({
	currentStep,
	totalSteps,
	type
}: ProgressIndicatorProps) {
	const percentage = (currentStep / totalSteps) * 100
	const bgColor =
		type === "in" ? "bg-[var(--clock-in)]" : "bg-[var(--clock-out)]"

	return (
		<div className="w-full flex bg-card border-b border-border">
			<div className="w-full ">
				<div className="max-w-md mx-auto px-4 py-4">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-foreground">
							Étape {currentStep} sur {totalSteps}
						</span>
						<span className="text-sm text-muted-foreground">
							{Math.round(percentage)}%
						</span>
					</div>
					<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
						<div
							className={`h-full ${bgColor} transition-all duration-300 ease-out`}
							style={{ width: `${percentage}%` }}
						/>
					</div>
				</div>
			</div>
			<div className="flex items-center gap-2 ">
				<Theme />
			</div>
		</div>
	)
}
