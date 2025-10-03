"use client"

import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import { EmailLoginForm } from "@/modules/auth/components/EmailLoginForm"
import { ArrowLeft } from "lucide-react"

import { useNavigate } from "@/hooks/useNavigate"

export default function LoginPage() {
	const { back } = useNavigate()
	return (
		<>
			<Button
				variant="ghost"
				onClick={() => back()}
				className="gap-2 self-start"
			>
				<ArrowLeft className="h-4 w-4" />
				Retour
			</Button>
			<Logo />
			<div className="flex flex-1 items-center justify-center px-4 max-w-xl mx-auto w-full">
				<EmailLoginForm />
			</div>
		</>
	)
}
