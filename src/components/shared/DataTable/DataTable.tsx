"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { exportToCSV } from "@/lib/exportToCSV"
import { cn } from "@/lib/utils"
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState
} from "@tanstack/react-table"
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Eye,
	FileDown,
	Filter,
	PlusCircle,
	X
} from "lucide-react"

interface BulkAction<TData> {
	label: string
	icon?: React.ReactNode
	action: (selectedRows: TData[]) => void
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	enableRowSelection?: boolean
	enableColumnVisibility?: boolean
	enableSorting?: boolean
	enableFiltering?: boolean
	className?: string
	filterOptions?: FilterOption[]
	enablePagination?: boolean
	pageSize?: number
	pageSizeOptions?: number[]
	rowActions?: (row: TData) => React.ReactNode
	bulkActions?: BulkAction<TData>[]
	onAddClick?: () => void
	onExportCSV?: (data: TData[]) => void
	exportTitle?: string
	exportSheetName?: string
}

interface FilterOption {
	column: string
	options: { label: string; value: string }[]
}

export function DataTable<TData, TValue>({
	columns,
	data,
	enableRowSelection = false,
	enableColumnVisibility = true,
	enableSorting = true,
	enableFiltering = true,
	className,
	filterOptions,
	enablePagination = true,
	pageSize = 10,
	pageSizeOptions = [10, 20, 30, 40, 50],
	rowActions,
	bulkActions,
	onAddClick,
	onExportCSV,
	exportTitle = "ExportedData",
	exportSheetName = "Sheet1"
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})
	const [filterValues, setFilterValues] = React.useState<
		Record<string, string>
	>({})

	const processedColumns = React.useMemo(() => {
		const baseColumns = [...columns]
		if (enableRowSelection) {
			const selectionColumn: ColumnDef<TData, TValue> = {
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
						aria-label="Select all"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				),
				enableSorting: false,
				enableHiding: false
			}
			baseColumns.unshift(selectionColumn)
		}

		if (rowActions) {
			const actionsColumn: ColumnDef<TData, TValue> = {
				id: "actions",
				cell: ({ row }) => rowActions(row.original)
			}
			baseColumns.push(actionsColumn)
		}

		return baseColumns
	}, [columns, enableRowSelection, rowActions])

	const table = useReactTable({
		data,
		columns: processedColumns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection
		},
		initialState: {
			pagination: {
				pageSize: enablePagination ? pageSize : data.length
			}
		}
	})

	const applyFilter = React.useCallback(
		(column: string, value: string) => {
			setFilterValues((prev) => ({
				...prev,
				[column]: value
			}))

			table.getColumn(column)?.setFilterValue(value)
		},
		[table]
	)

	const clearFilter = React.useCallback(
		(column: string) => {
			setFilterValues((prev) => {
				const newFilters = { ...prev }
				delete newFilters[column]
				return newFilters
			})
			table.getColumn(column)?.setFilterValue(undefined)
		},
		[table]
	)

	return (
		<div className={cn("w-full", className)}>
			<div className="flex flex-wrap items-center gap-2 py-4">
				{filterOptions &&
					filterOptions.map((filterOption) => (
						<select
							key={filterOption.column}
							onChange={(e) =>
								table
									.getColumn(filterOption.column)
									?.setFilterValue(e.target.value)
							}
							className="min-w-[150px] border rounded p-2"
						>
							<option value="">All {filterOption.column}</option>
							{filterOption.options.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					))}

				<div className="ml-auto flex flex-wrap gap-2">
					{onAddClick && (
						<Button variant="outline" size="sm" onClick={onAddClick}>
							<PlusCircle className="mr-2 h-4 w-4" /> Add
						</Button>
					)}

					<Button
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
					</Button>

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

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className={cn(
											"relative",
											enableSorting && header.column.getCanSort()
												? "cursor-pointer hover:bg-muted"
												: ""
										)}
									>
										<div className="flex items-center gap-2">
											<div
												className="flex gap-2"
												onClick={
													enableSorting && header.column.getCanSort()
														? () => header.column.toggleSorting()
														: undefined
												}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
												{enableSorting && header.column.getCanSort() && (
													<span className="flex items-center">
														{header.column.getIsSorted() === "desc" ? (
															<ArrowDown className="h-4 w-4" />
														) : header.column.getIsSorted() === "asc" ? (
															<ArrowUp className="h-4 w-4" />
														) : (
															<ArrowUpDown className="h-4 w-4" />
														)}
													</span>
												)}
											</div>

											{enableFiltering && header.column.getCanFilter() && (
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className={cn(
																"h-8 w-8 p-0",
																filterValues[header.column.id] && "text-primary"
															)}
														>
															<Filter className="h-4 w-4" />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-80" align="start">
														<div className="grid gap-4">
															<div className="space-y-2">
																<h4 className="font-medium leading-none">
																	Filter {header.column.id}
																</h4>
																<p className="text-sm text-muted-foreground">
																	Enter a value to filter this column
																</p>
															</div>
															<div className="grid gap-2">
																<div className="flex items-center gap-2">
																	<Input
																		placeholder="Filter value..."
																		value={filterValues[header.column.id] || ""}
																		onChange={(e) =>
																			applyFilter(
																				header.column.id,
																				e.target.value
																			)
																		}
																	/>
																	{filterValues[header.column.id] && (
																		<Button
																			variant="ghost"
																			size="sm"
																			onClick={() =>
																				clearFilter(header.column.id)
																			}
																		>
																			<X className="h-4 w-4" />
																		</Button>
																	)}
																</div>
															</div>
														</div>
													</PopoverContent>
												</Popover>
											)}
										</div>
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{enablePagination && (
				<div className="mt-4 flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
						<div className="flex flex-wrap items-center gap-2">
							<p className="text-sm font-medium">Rows per page</p>
							<select
								value={table.getState().pagination.pageSize}
								onChange={(e) => {
									table.setPageSize(Number(e.target.value))
								}}
								className="h-8 w-[70px] rounded-md border border-input bg-background"
							>
								{pageSizeOptions.map((pageSize) => (
									<option key={pageSize} value={pageSize}>
										{pageSize}
									</option>
								))}
							</select>
						</div>
						<div className="text-sm text-muted-foreground">
							{table.getFilteredSelectedRowModel().rows.length} of{" "}
							{table.getFilteredRowModel().rows.length} row(s) selected
						</div>
						{enableRowSelection &&
							bulkActions &&
							table.getSelectedRowModel().rows.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{bulkActions.map((action, index) => (
										<Button
											key={index}
											variant="outline"
											size="sm"
											onClick={() =>
												action.action(
													table
														.getSelectedRowModel()
														.rows.map((row) => row.original)
												)
											}
										>
											{action.icon && (
												<span className="mr-2">{action.icon}</span>
											)}
											{action.label}
										</Button>
									))}
								</div>
							)}
					</div>
					<div className="flex items-center gap-2 sm:gap-6">
						<div className="flex w-[100px] items-center justify-center text-sm font-medium">
							Page {table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount()}
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to first page</span>
								<ChevronsLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className="sr-only">Go to previous page</span>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to next page</span>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								<span className="sr-only">Go to last page</span>
								<ChevronsRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
