"use client"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { usePasswordForm } from "../hooks/usePasswordForm"

export function PasswordForm() {
	const { form, onSubmit, isLoading } = usePasswordForm()

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="currentPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mot de passe actuel</FormLabel>
							<FormControl>
								<Input {...field} type="password" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="newPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nouveau mot de passe</FormLabel>
							<FormControl>
								<Input {...field} type="password" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirmer le mot de passe</FormLabel>
							<FormControl>
								<Input {...field} type="password" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end gap-4">
					<Button variant="outline" type="button" disabled={isLoading}>
						Annuler
					</Button>
					<Button
						type="submit"
						className="bg-tertiary text-tertiary-foreground hover:bg-tertiary/90"
						disabled={isLoading}
					>
						{isLoading ? "Mise à jour..." : "Enregistrer les changements"}
					</Button>
				</div>
			</form>
		</Form>
	)
}
