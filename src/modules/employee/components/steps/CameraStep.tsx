"use client"

import { useRef, useState } from "react"
import Webcam from "react-webcam"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Camera, RotateCcw } from "lucide-react"

interface CameraStepProps {
	type: "in" | "out"
	onCapture: (photo: string) => void
	onBack: () => void
}

export function CameraStep({ type, onCapture, onBack }: CameraStepProps) {
	const [photo, setPhoto] = useState<string | null>(null)
	const [cameraStarted, setCameraStarted] = useState(false)
	const webcamRef = useRef<Webcam>(null)

	const startCamera = () => {
		setCameraStarted(true)
	}

	const capturePhoto = () => {
		if (webcamRef.current) {
			const imageSrc = webcamRef.current.getScreenshot()
			if (imageSrc) {
				setPhoto(imageSrc)
			}
		}
	}

	const retakePhoto = () => {
		setPhoto(null)
	}

	const confirmPhoto = () => {
		if (photo) {
			onCapture(photo)
		}
	}

	const handleUserMediaError = (error: string | DOMException) => {
		console.error("Camera error:", error)
		alert("Camera access denied. Please enable camera permissions.")
		setCameraStarted(false)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center space-y-3">
				<div className="flex justify-center">
					<div
						className={`w-16 h-16 rounded-full flex items-center justify-center ${type === "in" ? "bg-emerald-500" : "bg-red-500"}`}
					>
						<Camera className="w-8 h-8 text-white" />
					</div>
				</div>
				<h1 className="text-2xl font-bold text-balance">Take a Selfie</h1>
				<p className="text-muted-foreground text-balance">
					We need to verify your identity
				</p>
			</div>

			{/* Camera/Photo Display */}
			<Card className="p-4 overflow-hidden">
				<div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
					{!cameraStarted && !photo && (
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="text-center space-y-3">
								<Camera className="w-16 h-16 text-muted-foreground mx-auto" />
								<p className="text-sm text-muted-foreground">
									Camera not started
								</p>
							</div>
						</div>
					)}
					{cameraStarted && !photo && (
						<Webcam
							ref={webcamRef}
							audio={false}
							screenshotFormat="image/jpeg"
							videoConstraints={{
								facingMode: "user"
							}}
							onUserMediaError={handleUserMediaError}
							className="w-full h-full object-cover"
						/>
					)}
					{photo && (
						<Image
							src={photo || "/placeholder.svg"}
							alt="Captured selfie"
							className="w-full h-full object-cover"
							width={300}
							height={400}
						/>
					)}
				</div>
			</Card>

			{/* Actions */}
			<div className="space-y-3">
				{!cameraStarted && !photo && (
					<>
						<Button
							variant="outline"
							size="lg"
							className={`w-full h-14 text-lg font-semibold border-2 ${
								type === "in"
									? "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600"
									: "border-red-500 bg-red-500 text-white hover:bg-red-600"
							}`}
							onClick={startCamera}
						>
							<Camera className="w-5 h-5 mr-2" />
							Start Camera
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="w-full h-14 border-2 bg-transparent"
							onClick={onBack}
						>
							<ArrowLeft className="w-5 h-5 mr-2" />
							Go Back
						</Button>
					</>
				)}
				{cameraStarted && !photo && (
					<>
						<Button
							variant="outline"
							size="lg"
							className={`w-full h-14 text-lg font-semibold border-2 ${
								type === "in"
									? "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600"
									: "border-red-500 bg-red-500 text-white hover:bg-red-600"
							}`}
							onClick={capturePhoto}
						>
							<Camera className="w-5 h-5 mr-2" />
							Capture Photo
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="w-full h-14 border-2 bg-transparent"
							onClick={() => setCameraStarted(false)}
						>
							Cancel
						</Button>
					</>
				)}
				{photo && (
					<>
						<Button
							variant="outline"
							size="lg"
							className={`w-full h-14 text-lg font-semibold border-2 ${
								type === "in"
									? "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600"
									: "border-red-500 bg-red-500 text-white hover:bg-red-600"
							}`}
							onClick={confirmPhoto}
						>
							Confirm Photo
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="w-full h-14 border-2 bg-transparent"
							onClick={retakePhoto}
						>
							<RotateCcw className="w-5 h-5 mr-2" />
							Retake Photo
						</Button>
					</>
				)}
			</div>
		</div>
	)
}
