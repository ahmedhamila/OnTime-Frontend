"use client"

import { useState } from "react"
import Image from "next/image"

import { DataTable } from "@/components/shared/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { Clock } from "@/modules/employee/types/clock"
import type { ColumnDef } from "@tanstack/react-table"
import { ImageIcon, MapPin, MoreHorizontal, Phone } from "lucide-react"
import { toast } from "sonner"

interface AllClocksTableProps {
	clocks: Clock[]
}

export function AllClocksTable({ clocks }: AllClocksTableProps) {
	const [photoDialog, setPhotoDialog] = useState<{
		open: boolean
		photo: string
		name: string
	}>({
		open: false,
		photo: "",
		name: ""
	})

	const columns: ColumnDef<Clock>[] = [
		{
			accessorKey: "employee.firstName",
			header: "Prénom"
		},
		{
			accessorKey: "employee.lastName",
			header: "Nom"
		},
		{
			accessorKey: "employee.phoneNumber",
			header: "Téléphone"
		},
		{
			accessorKey: "clockType",
			header: "Type",
			cell: ({ row }) => {
				const clockType = row.original.clockType
				return (
					<Badge variant={clockType === "in" ? "default" : "secondary"}>
						{clockType === "in" ? "Entrée" : "Sortie"}
					</Badge>
				)
			}
		},
		{
			accessorKey: "timestamp",
			header: "Date & Heure",
			cell: ({ row }) => {
				const date = new Date(row.original.timestamp)
				return (
					<span className="whitespace-nowrap">
						{date.toLocaleString("fr-FR", {
							timeZone: "Europe/Paris"
						})}
					</span>
				)
			}
		},
		{
			id: "location",
			header: "Localisation",
			cell: ({ row }) => {
				const { locationLat, locationLng } = row.original
				return (
					<span className="text-sm text-muted-foreground">
						{locationLat.toFixed(4)}, {locationLng.toFixed(4)}
					</span>
				)
			}
		}
	]

	const rowActions = (row: Clock) => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
				>
					<span className="sr-only">Ouvrir le menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="font-medium">Actions</DropdownMenuLabel>

				<DropdownMenuItem
					onClick={() => {
						setPhotoDialog({
							open: true,
							photo: row.photo,
							name: `${row.employee.firstName} ${row.employee.lastName}`
						})
					}}
					className="flex items-center gap-2 cursor-pointer"
				>
					<ImageIcon className="h-4 w-4 text-slate-500" />
					<span>Voir la Photo</span>
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={() => {
						const mapsUrl = `https://www.google.com/maps?q=${row.locationLat},${row.locationLng}`
						window.open(mapsUrl, "_blank")
					}}
					className="flex items-center gap-2 cursor-pointer"
				>
					<MapPin className="h-4 w-4 text-slate-500" />
					<span>Voir sur la Carte</span>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onClick={() => {
						navigator.clipboard.writeText(row.employee.phoneNumber)
						toast.success("Téléphone copié dans le presse-papiers")
					}}
					className="flex items-center gap-2 cursor-pointer"
				>
					<Phone className="h-4 w-4 text-slate-500" />
					<span>Copier Téléphone</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)

	return (
		<>
			<DataTable
				columns={columns}
				data={clocks}
				enableRowSelection
				enableColumnVisibility
				enableFiltering
				enableSorting
				rowActions={rowActions}
				exportTitle="Pointages"
				exportSheetName="Clocks"
				pageSizeOptions={[10, 20, 50, 100]}
				filterableColumns={[
					"employee.firstName",
					"employee.lastName",
					"employee.phoneNumber",
					"clockType"
				]}
				enableGlobalFiltering={false}
			/>

			<Dialog
				open={photoDialog.open}
				onOpenChange={(open) => setPhotoDialog({ ...photoDialog, open })}
			>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Photo de Pointage - {photoDialog.name}</DialogTitle>
					</DialogHeader>
					<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
						<Image
							src={photoDialog.photo || "/placeholder.svg"}
							alt={`Photo de ${photoDialog.name}`}
							className="h-full w-full object-contain"
							width={640}
							height={480}
						/>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
