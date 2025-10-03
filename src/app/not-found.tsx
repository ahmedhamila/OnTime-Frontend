"use client"

import Link from "next/link"

import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

import { useNavigate } from "@/hooks/useNavigate"

export default function NotFound() {
	const { back } = useNavigate()

	return (
		<div className="flex h-screen w-full items-center justify-center bg-background">
			<div className="flex max-w-[500px] flex-col items-center justify-center gap-8 text-center p-4">
				<Logo />
				<div className="space-y-4">
					<h1 className="text-4xl font-bold">404</h1>
					<h2 className="text-2xl font-semibold tracking-tight">
						Page non trouvée
					</h2>
					<p className="text-muted-foreground">
						Désolé, nous n&apos;avons pas trouvé la page que vous recherchez.
					</p>
				</div>
				<div className="flex gap-4">
					<Button variant="outline" asChild className="gap-2">
						<Link href="/dashboard">
							<Home className="h-4 w-4" />
							Accueil
						</Link>
					</Button>
					<Button className="gap-2" onClick={() => back()}>
						<ArrowLeft className="h-4 w-4" />
						Retour
					</Button>
				</div>
			</div>
		</div>
	)
}
