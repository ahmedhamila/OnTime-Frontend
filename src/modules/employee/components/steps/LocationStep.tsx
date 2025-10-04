"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Loader2, MapPin } from "lucide-react"

interface LocationStepProps {
	type: "in" | "out"
	onCapture: (coords: { lat: number; lng: number }) => void
	onBack: () => void
}

export function LocationStep({ type, onCapture, onBack }: LocationStepProps) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const themeColor = type === "in" ? "var(--clock-in)" : "var(--clock-out)"

	const handleRequestLocation = () => {
		setLoading(true)
		setError(null)

		if ("geolocation" in navigator) {
			// CRITICAL: High accuracy options
			const options = {
				enableHighAccuracy: true, // Force GPS instead of WiFi/Cell towers
				timeout: 30000, // 30 seconds timeout (GPS needs time)
				maximumAge: 0 // Don't use cached position
			}

			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLoading(false)

					// Log accuracy for debugging
					console.log(`Accuracy: ${position.coords.accuracy} meters`)

					// Warn if accuracy is poor (optional but recommended)
					if (position.coords.accuracy > 100) {
						setError(
							`Location acquired but accuracy is low (${Math.round(position.coords.accuracy)}m). Please ensure GPS is enabled.`
						)
					}

					onCapture({
						lat: position.coords.latitude,
						lng: position.coords.longitude
					})
				},
				(err) => {
					setLoading(false)
					console.error("[Geolocation error]:", err)

					// Better error messages
					let errorMessage = "Unable to get location. "
					switch (err.code) {
						case err.PERMISSION_DENIED:
							errorMessage += "Please enable location permissions."
							break
						case err.POSITION_UNAVAILABLE:
							errorMessage += "Location unavailable. Ensure GPS is enabled."
							break
						case err.TIMEOUT:
							errorMessage += "Request timed out. Please try again."
							break
					}

					setError(errorMessage)
					// DON'T use mock location for production!
				},
				options // <- THIS IS THE KEY FIX
			)
		} else {
			setLoading(false)
			setError("Geolocation not supported on this device.")
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
						<MapPin
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
				<h1 className="text-2xl font-bold text-balance">Verify Location</h1>
				<p className="text-muted-foreground text-balance">
					We need to confirm your location
				</p>
			</div>

			{/* Info Card */}
			<Card className="p-6">
				<div className="space-y-4">
					<div className="flex items-start gap-3">
						<MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
						<div>
							<h3 className="font-semibold mb-1">Why we need this</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Your location helps verify you&apos;re clocking{" "}
								{type === "in" ? "in" : "out"} from an authorized work site.
							</p>
						</div>
					</div>
				</div>
			</Card>

			{error && (
				<div className="p-4 rounded-lg bg-secondary border border-border">
					<p className="text-sm text-muted-foreground text-center">{error}</p>
				</div>
			)}

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
					onClick={handleRequestLocation}
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader2 className="w-5 h-5 mr-2 animate-spin" />
							Getting Location...
						</>
					) : (
						"Allow Location Access"
					)}
				</Button>
				<Button
					variant="outline"
					size="lg"
					className="w-full h-14 border-2 bg-transparent"
					onClick={onBack}
					disabled={loading}
				>
					<ArrowLeft className="w-5 h-5 mr-2" />
					Go Back
				</Button>
			</div>
		</div>
	)
}
