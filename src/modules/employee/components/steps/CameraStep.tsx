"use client"

import { useRef, useState } from "react"
import Webcam from "react-webcam"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Camera, RotateCcw } from "lucide-react"
import { toast } from "sonner"

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
			const imageSrc = webcamRef.current.getScreenshot({
				width: 1280,
				height: 720
			})
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
		toast.error(
			"Accès à la caméra refusé. Veuillez activer les autorisations de la caméra."
		)

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
				<h1 className="text-2xl font-bold text-balance">Prenez un selfie</h1>
				<p className="text-muted-foreground text-balance">
					Nous devons vérifier votre identité
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
									Caméra non démarrée
								</p>
							</div>
						</div>
					)}
					{cameraStarted && !photo && (
						<Webcam
							ref={webcamRef}
							audio={false}
							screenshotFormat="image/jpeg"
							screenshotQuality={1}
							videoConstraints={{
								width: 1280,
								height: 720,
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
							Démarrer la caméra
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
							Prendre la photo
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="w-full h-14 border-2 bg-transparent"
							onClick={() => setCameraStarted(false)}
						>
							Annuler
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
							Confirmer la photo
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="w-full h-14 border-2 bg-transparent"
							onClick={retakePhoto}
						>
							<RotateCcw className="w-5 h-5 mr-2" />
							Reprendre la photo
						</Button>
					</>
				)}
			</div>
		</div>
	)
}
