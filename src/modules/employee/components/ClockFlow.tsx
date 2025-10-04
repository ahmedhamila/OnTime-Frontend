"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useEmployeeByPin } from "@/modules/employee/hooks/useEmployeeByPin"
import { Home } from "lucide-react"

import { useCreateClockForm } from "../hooks/useCreateClockForm"
import { ProgressIndicator } from "./ProgressIndicator"
import { CameraStep } from "./steps/CameraStep"
import { ConfirmationStep } from "./steps/ConfirmationStep"
import { ErrorStep } from "./steps/ErrorStep"
import { LocationStep } from "./steps/LocationStep"
import { PinStep } from "./steps/PinStep"
import { SuccessStep } from "./steps/SuccessStep"

type ClockType = "in" | "out"

interface ClockFlowProps {
	type: ClockType
}

export function ClockFlow({ type }: ClockFlowProps) {
	const router = useRouter()
	const [currentStep, setCurrentStep] = useState(1)
	const [employee, setEmployee] = useState<{ name: string; id: number } | null>(
		null
	)
	const [errorMessage, setErrorMessage] = useState<string>("")

	const employeeByPinMutation = useEmployeeByPin()

	const { form, handleSubmit, createClockMutation } = useCreateClockForm({
		onSuccess: () => {
			setCurrentStep(5) // Navigate to success step
		},
		onError: (error) => {
			const detailedError =
				error instanceof Error && "response" in error
					? (error as any).response?.data?.errors?.[0]?.detail
					: null
			setErrorMessage(
				detailedError || `Failed to clock ${type === "in" ? "in" : "out"}`
			)
			setCurrentStep(6) // Navigate to error step
		}
	})

	const totalSteps = 5

	const handlePinSubmit = (enteredPin: string) => {
		employeeByPinMutation.mutate(enteredPin, {
			onSuccess: (foundEmployee) => {
				setEmployee({
					name: `${foundEmployee.firstName} ${foundEmployee.lastName}`,
					id: foundEmployee.id
				})
				form.setValue("pinCode", enteredPin)
				form.setValue("clockType", type)
				setCurrentStep(2)
			}
		})
	}

	const handleConfirmation = () => {
		setCurrentStep(3)
	}

	const handleLocationCapture = (coords: { lat: number; lng: number }) => {
		form.setValue("locationLat", coords.lat)
		form.setValue("locationLng", coords.lng)
		setCurrentStep(4)
	}

	const handlePhotoCapture = (photoData: string) => {
		form.setValue("photo", photoData)
		handleSubmit(form.getValues())
	}

	const handleRetry = () => {
		setCurrentStep(4)
		setErrorMessage("")
	}

	const handleBackToHome = () => {
		router.push("/")
	}

	return (
		<div className="min-h-screen flex flex-col bg-background">
			{/* Progress Indicator */}
			<ProgressIndicator
				currentStep={currentStep}
				totalSteps={totalSteps}
				type={type}
			/>

			{/* Main Content */}
			<div className="flex-1 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					{currentStep === 1 && (
						<PinStep
							type={type}
							onSubmit={handlePinSubmit}
							isLoading={employeeByPinMutation.isPending}
						/>
					)}
					{currentStep === 2 && employee && (
						<ConfirmationStep
							type={type}
							employeeName={employee.name}
							onConfirm={handleConfirmation}
							onBack={() => setCurrentStep(1)}
						/>
					)}
					{currentStep === 3 && (
						<LocationStep
							type={type}
							onCapture={handleLocationCapture}
							onBack={() => setCurrentStep(2)}
						/>
					)}
					{currentStep === 4 && (
						<CameraStep
							type={type}
							onCapture={handlePhotoCapture}
							onBack={() => setCurrentStep(3)}
						/>
					)}
					{currentStep === 5 && employee && (
						<SuccessStep type={type} employeeName={employee.name} />
					)}
					{currentStep === 6 && (
						<ErrorStep type={type} errorMessage={errorMessage} />
					)}
				</div>
			</div>
			<div className="fixed bottom-6 right-6 z-10">
				<Button
					variant="outline"
					size="lg"
					onClick={handleBackToHome}
					className="gap-2 bg-background shadow-lg border-2"
				>
					<Home className="w-5 h-5" />
					Home
				</Button>
			</div>
		</div>
	)
}
