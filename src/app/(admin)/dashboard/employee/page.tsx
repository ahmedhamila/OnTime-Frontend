"use client"

import { useState } from "react"

import { DataTable } from "@/components/shared/DataTable"
import { DeleteDialog } from "@/components/shared/DeleteDialog"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { AddEmployeeDialog } from "@/modules/employee/components/AddEmployeeDialog"
import { UpdateEmployeeDialog } from "@/modules/employee/components/UpdateEmployeeDialog"
import { useBulkDeleteEmployees } from "@/modules/employee/hooks/useBulkDeleteEmployees"
import { useDeleteEmployee } from "@/modules/employee/hooks/useDeleteEmployee"
import { useEmployees } from "@/modules/employee/hooks/useEmployees"
import { Employee } from "@/modules/employee/types/employee"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, KeyRound, MoreHorizontal, Phone, Trash2 } from "lucide-react"
import { toast } from "sonner"

function EmployeesPage() {
	const { data: employees, isLoading, error } = useEmployees()

	const deleteEmployeeMutation = useDeleteEmployee()
	const bulkDeleteEmployees = useBulkDeleteEmployees()

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
	const [selectedEmployee, setSelectedEmployee] = useState<
		Employee | undefined
	>(undefined)

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null)
	const [employeesToDelete, setEmployeesToDelete] = useState<Employee[]>([])

	const openAddDialog = () => {
		setIsAddDialogOpen(true)
	}

	const openEditDialog = (employee: Employee) => {
		setSelectedEmployee(employee)
		setIsUpdateDialogOpen(true)
	}

	const openDeleteDialog = (id: number) => {
		setEmployeeToDelete(id)
		setIsDeleteDialogOpen(true)
	}

	const openBulkDeleteDialog = (selectedRows: Employee[]) => {
		setEmployeesToDelete(selectedRows)
		setIsDeleteDialogOpen(true)
	}

	const handleDelete = () => {
		if (employeeToDelete !== null) {
			deleteEmployeeMutation.mutate(employeeToDelete)
		} else if (employeesToDelete.length > 0) {
			bulkDeleteEmployees(employeesToDelete)
		}
		setIsDeleteDialogOpen(false)
		setEmployeeToDelete(null)
		setEmployeesToDelete([])
	}

	const columns: ColumnDef<Employee>[] = [
		{
			accessorKey: "firstName",
			header: "Prénom"
		},
		{
			accessorKey: "lastName",
			header: "Nom"
		},
		{
			accessorKey: "phoneNumber",
			header: "Téléphone"
		},
		{
			accessorKey: "pinCode",
			header: "Code PIN",
			cell: ({ row }) => {
				const pinCode = row.getValue("pinCode") as string
				return <span className="font-mono">{"•".repeat(pinCode.length)}</span>
			}
		}
	]

	const rowActions = (row: Employee) => (
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
						navigator.clipboard.writeText(row.phoneNumber)
						toast.success("Téléphone copié dans le presse-papiers")
					}}
					className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
				>
					<Phone className="h-4 w-4 text-slate-500" />
					<span>Copier Téléphone</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						navigator.clipboard.writeText(row.pinCode)
						toast.success("Code PIN copié dans le presse-papiers")
					}}
					className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
				>
					<KeyRound className="h-4 w-4 text-slate-500" />
					<span>Copier Code PIN</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => openEditDialog(row)}
					className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
				>
					<Edit className="h-4 w-4 text-slate-500" />
					<span>Modifier</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => openDeleteDialog(row.id)}
					className="flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors mt-1"
				>
					<Trash2 className="h-4 w-4" />
					<span>Supprimer</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)

	const bulkActions = [
		{
			label: "Supprimer",
			icon: <Trash2 className="h-4 w-4" />,
			action: openBulkDeleteDialog
		}
	]

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-96 w-full" />
			</div>
		)
	}

	if (error) {
		return <div>Une erreur s&apos;est produite: {error.message}</div>
	}

	return (
		<>
			<DataTable
				columns={columns}
				data={employees || []}
				enableRowSelection
				enableColumnVisibility
				enableFiltering
				enableSorting
				rowActions={rowActions}
				onAddClick={openAddDialog}
				exportTitle="Employés"
				exportSheetName="Employees"
				pageSizeOptions={[5, 10, 20, 50]}
				bulkActions={bulkActions}
				filterableColumns={["firstName", "lastName", "phoneNumber"]}
				enableGlobalFiltering={false}
			/>

			<AddEmployeeDialog
				open={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}
			/>

			<UpdateEmployeeDialog
				open={isUpdateDialogOpen}
				onOpenChange={setIsUpdateDialogOpen}
				employeeData={selectedEmployee}
			/>
			<DeleteDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={handleDelete}
				title={
					employeesToDelete.length > 0
						? "Supprimer les Employés"
						: "Supprimer l'Employé"
				}
				description={
					employeesToDelete.length > 0
						? `Êtes-vous sûr de vouloir supprimer ${employeesToDelete.length} employé${employeesToDelete.length > 1 ? "s" : ""} ?`
						: "Êtes-vous sûr de vouloir supprimer cet employé ?"
				}
				confirmText="Supprimer"
				cancelText="Annuler"
			/>
		</>
	)
}

export default EmployeesPage
