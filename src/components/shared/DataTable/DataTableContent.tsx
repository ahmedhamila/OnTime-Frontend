import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"
import { flexRender, Table as TableInstance } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, Filter, X } from "lucide-react"

interface DataTableContentProps<TData> {
	table: TableInstance<TData>
	enableSorting?: boolean
	enableFiltering?: boolean
	filterValues: Record<string, string>
	onFilterApply: (column: string, value: string) => void
	onFilterClear: (column: string) => void
	filterableColumns?: string[]
	enableGlobalFiltering?: boolean
	onRowDoubleClick?: (row: TData) => void
}

export function DataTableContent<TData>({
	table,
	enableSorting,
	enableFiltering,
	filterValues,
	onFilterApply,
	onFilterClear,
	filterableColumns,
	enableGlobalFiltering,
	onRowDoubleClick
}: DataTableContentProps<TData>) {
	return (
		<div className="rounded-md border">
			<div className="overflow-x-auto">
				<div className="max-h-[585px] overflow-y-auto overflow-x-auto">
					<Table>
						<TableHeader className="sticky top-0  bg-background">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead
											key={header.id}
											className={cn(
												"relative whitespace-nowrap",
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

												{enableFiltering &&
													(enableGlobalFiltering ||
														(filterableColumns &&
															filterableColumns.some(
																(fc) =>
																	header.column.id.startsWith(fc) ||
																	header.column.id.includes(fc)
															))) &&
													header.column.getCanFilter() && (
														<Popover>
															<PopoverTrigger asChild>
																<Button
																	variant="ghost"
																	size="sm"
																	className={cn(
																		"h-8 w-8 p-0",
																		filterValues[header.column.id] &&
																			"text-primary"
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
																				value={
																					filterValues[header.column.id] || ""
																				}
																				onChange={(e) =>
																					onFilterApply(
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
																						onFilterClear(header.column.id)
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
										onDoubleClick={() => onRowDoubleClick?.(row.original)}
										className={cn(onRowDoubleClick && "hover:bg-muted/50")}
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
										colSpan={table.getAllColumns().length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	)
}
