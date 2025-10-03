"use client"

import { useEffect, useState } from "react"

import { AvatarUpload } from "@/components/shared/AvatarUpload"
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
import { Skeleton } from "@/components/ui/skeleton"

import { useCurrentUser } from "@/hooks/useCurrentUser"

import { useAccountInfoForm } from "../hooks/useAccountInfoForm"
import type { AccountInfoValues } from "../schemas/AccountInfoSchema"

interface AccountInfoFormProps {
	defaultValues?: Partial<AccountInfoValues>
}

export function AccountInfoForm({ defaultValues }: AccountInfoFormProps) {
	const { data: userEntry, isLoading: isLoadingUser } = useCurrentUser()
	const {
		form,
		onSubmit,
		isLoading: isSubmitting
	} = useAccountInfoForm(defaultValues)

	const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
		userEntry?.image
	)

	useEffect(() => {
		if (userEntry) {
			form.reset({
				firstName: userEntry.firstName,
				lastName: userEntry.lastName,
				email: userEntry.email,
				phoneNumber: userEntry.phoneNumber,
				...defaultValues
			})
			setAvatarPreview(userEntry.image)
		}
	}, [userEntry, form, defaultValues])

	const handleAvatarChange = (file: File) => {
		form.setValue("image", file)
		setAvatarPreview(URL.createObjectURL(file))
	}

	if (isLoadingUser) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-24 w-24 rounded-full" />
				<div className="grid grid-cols-2 gap-4">
					<Skeleton className="h-10" />
					<Skeleton className="h-10" />
				</div>
				<Skeleton className="h-10" />
				<Skeleton className="h-10" />
			</div>
		)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Image</FormLabel>
							<FormControl>
								<AvatarUpload
									currentAvatar={avatarPreview}
									onFileSelect={(file) => {
										field.onChange(file)
										handleAvatarChange(file)
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Prénom</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nom</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-mail</FormLabel>
							<FormControl>
								<Input {...field} type="email" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phoneNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Numéro de téléphone</FormLabel>
							<FormControl>
								<Input {...field} type="tel" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end gap-4">
					<Button variant="outline" type="button" disabled={isSubmitting}>
						Annuler
					</Button>
					<Button
						type="submit"
						className="bg-tertiary text-tertiary-foreground hover:bg-tertiary/90"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Enregistrement..." : "Enregistrer les changements"}
					</Button>
				</div>
			</form>
		</Form>
	)
}
