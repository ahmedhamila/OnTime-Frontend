import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import { Table } from "@tanstack/react-table"
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight
} from "lucide-react"

import { BulkAction } from "./types"

interface DataTablePaginationProps<TData> {
	table: Table<TData>
	pageSizeOptions: number[]
	enableRowSelection?: boolean
	bulkActions?: BulkAction<TData>[]
}

export function DataTablePagination<TData>({
	table,
	pageSizeOptions,
	enableRowSelection,
	bulkActions
}: DataTablePaginationProps<TData>) {
	return (
		<div className="mt-4 flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
			<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
				<div className="flex flex-wrap items-center gap-2 py-1">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={table.getState().pagination.pageSize.toString()}
						onValueChange={(value) => table.setPageSize(Number(value))}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder="Rows" />
						</SelectTrigger>
						<SelectContent>
							{pageSizeOptions.map((pageSize) => (
								<SelectItem key={pageSize} value={pageSize.toString()}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{enableRowSelection && (
					<div className="text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} of{" "}
						{table.getFilteredRowModel().rows.length} row(s) selected
					</div>
				)}

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
									{action.icon && <span className="mr-2">{action.icon}</span>}
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
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
						aria-label="Go to first page"
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						aria-label="Go to previous page"
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<div className="flex items-center gap-2">
						{table.getPageOptions().map((page) => {
							const isCurrentPage =
								page === table.getState().pagination.pageIndex
							const isNearCurrentPage =
								Math.abs(page - table.getState().pagination.pageIndex) <= 1

							if (
								!isNearCurrentPage &&
								page !== 0 &&
								page !== table.getPageCount() - 1
							) {
								if (page === 1 || page === table.getPageCount() - 2) {
									return <span key={page}>...</span>
								}
								return null
							}

							return (
								<Button
									key={page}
									variant={isCurrentPage ? "default" : "outline"}
									className="h-8 w-8 p-0"
									onClick={() => table.setPageIndex(page)}
								>
									{page + 1}
								</Button>
							)
						})}
					</div>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						aria-label="Go to next page"
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
						aria-label="Go to last page"
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
