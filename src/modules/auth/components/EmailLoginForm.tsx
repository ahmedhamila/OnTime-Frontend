"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { useEmailLoginForm } from "../hooks/useEmailLoginForm"

export function EmailLoginForm() {
	const { register, handleSubmit, errors, onSubmit, loginMutation } =
		useEmailLoginForm()
	const [showPassword, setShowPassword] = useState(false)
	return (
		<div className="flex flex-col w-full ">
			<div className="flex flex-col space-y-2 mb-8">
				<h1 className="text-4xl text-tertiary font-bold mb-4">Se connecter</h1>
				<p className="text-sm text-muted-foreground">
					Renseigner l&apos;email avec lequel vous avez publié votre annonce de
					recherche
				</p>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col space-y-6"
			>
				<div className="flex flex-col space-y-2">
					<label htmlFor="email" className="text-sm">
						E-mail
					</label>
					<Input
						id="email"
						placeholder="E-mail"
						className="h-12"
						{...register("email")}
					/>
					{errors.email && (
						<span className="text-sm text-red-500">{errors.email.message}</span>
					)}
				</div>

				<div className="flex flex-col space-y-2">
					<div className="flex items-center justify-between">
						<label htmlFor="password" className="text-sm">
							Mot de passe
						</label>
					</div>
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							{...register("password")}
							placeholder="Enter your password"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<EyeOff className="h-4 w-4 text-muted-foreground" />
							) : (
								<Eye className="h-4 w-4 text-muted-foreground" />
							)}
						</Button>
					</div>
					{errors.password && (
						<p className="text-sm text-red-500">{errors.password.message}</p>
					)}
				</div>

				<Button
					type="submit"
					className="h-12 bg-tertiary hover:bg-tertiary/90 dark:text-white"
					disabled={loginMutation.isPending}
				>
					{loginMutation.isPending ? (
						<>
							<Loader2 className="w-5 h-5 mr-2 animate-spin" />
							Connexion en cours...
						</>
					) : (
						"Se Connecter"
					)}
				</Button>
			</form>
		</div>
	)
}
