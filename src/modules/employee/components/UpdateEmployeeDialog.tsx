"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Separator } from "@/components/ui/separator"

import { useUpdateEmployeeForm } from "../hooks/useUpdateEmployeeForm"
import { Employee } from "../types/employee"

type UpdateEmployeeDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	employeeData: Employee | undefined
}

export const UpdateEmployeeDialog: React.FC<UpdateEmployeeDialogProps> = ({
	open,
	onOpenChange,
	employeeData
}) => {
	const { form, handleSubmit, updateEmployeeMutation } = useUpdateEmployeeForm(
		onOpenChange,
		employeeData
	)

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-[520px] p-6">
				<DialogHeader>
					<DialogTitle className="text-xl">Modifier l&apos;Employé</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Prénom</FormLabel>
										<FormControl>
											<Input
												placeholder="Entrer prénom"
												className="h-11"
												{...field}
											/>
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
											<Input
												placeholder="Entrer nom"
												className="h-11"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="phoneNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Numéro de téléphone</FormLabel>
									<FormControl>
										<PhoneInput
											inDlg={true}
											placeholder="Entrer numéro"
											defaultCountry="FR"
											className="h-11"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="pinCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Code PIN</FormLabel>
									<FormControl>
										<Input
											type="text"
											placeholder="Entrer code PIN (4 chiffres)"
											className="h-11"
											maxLength={4}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Separator className="my-4" />
						<Button
							type="submit"
							disabled={updateEmployeeMutation.isPending}
							className="w-full h-11"
						>
							{updateEmployeeMutation.isPending
								? "Mise à jour..."
								: "Mettre à jour"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
