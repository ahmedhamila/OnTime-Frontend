import { useState, type KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { exportToCSV } from "@/lib/exportToCSV"
import { Table } from "@tanstack/react-table"
import { Eye, FileDown, PlusCircle, Search, X } from "lucide-react"

import { FilterOption } from "./types"

interface DataTableToolbarProps<TData> {
	data: TData[]
	table: Table<TData>
	filterOptions?: FilterOption[]
	onAddClick?: () => void
	onExportCSV?: (data: TData[]) => void
	exportTitle?: string
	exportSheetName?: string
	enableColumnVisibility?: boolean
	enableSearch?: boolean
	searchValue?: string
	onSearch?: (value: string) => void
}

export function DataTableToolbar<TData>({
	data,
	table,
	filterOptions,
	onAddClick,
	onExportCSV,
	exportTitle = "ExportedData",
	exportSheetName = "Sheet1",
	enableColumnVisibility,
	enableSearch,
	searchValue = "",
	onSearch
}: DataTableToolbarProps<TData>) {
	const [inputValue, setInputValue] = useState(searchValue)

	const handleSearch = () => {
		if (inputValue.trim() !== searchValue) {
			onSearch?.(inputValue.trim())
		}
	}

	const handleClear = () => {
		setInputValue("")
		if (searchValue) {
			onSearch?.("")
		}
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSearch()
		}
	}
	return (
		<div className="flex flex-wrap items-center gap-2 py-3 px-1">
			{enableSearch && (
				<div className="relative ">
					<Input
						placeholder="Rechercher..."
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						className="pr-20"
					/>
					<div className="absolute right-0 top-0 h-full flex items-center gap-0.5 pr-2">
						{inputValue && (
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={handleClear}
								className="h-7 w-7 p-0 hover:bg-muted"
							>
								<X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
								<span className="sr-only">Clear search</span>
							</Button>
						)}
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleSearch}
							className="h-7 w-7 p-0 hover:bg-muted"
						>
							<Search className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
							<span className="sr-only">Search</span>
						</Button>
					</div>
				</div>
			)}
			{filterOptions?.map((filterOption) => (
				<Select
					key={filterOption.column}
					onValueChange={(value) => {
						const filterValue = value === "all" ? "" : value
						table.getColumn(filterOption.column)?.setFilterValue(filterValue)
					}}
					defaultValue="all"
				>
					<SelectTrigger className="min-w-[150px] max-w-fit">
						<SelectValue placeholder={`Select ${filterOption.column}`} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All {filterOption.column}</SelectItem>
						{filterOption.options.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			))}

			<div className="ml-auto flex flex-wrap gap-2">
				{onAddClick && (
					<Button size="sm" onClick={onAddClick}>
						<PlusCircle className="mr-2 h-4 w-4" /> Ajouter
					</Button>
				)}

				{/* <Button
					variant="outline"
					size="sm"
					onClick={() =>
						onExportCSV
							? onExportCSV(data)
							: exportToCSV(data, exportTitle, exportSheetName)
					}
				>
					<FileDown className="mr-2 h-4 w-4" />
					Export
				</Button> */}

				{enableColumnVisibility && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<Eye className="mr-2 h-4 w-4" /> View
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</div>
	)
}
