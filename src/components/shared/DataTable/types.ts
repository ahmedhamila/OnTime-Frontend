import { ReactNode } from "react"

import { ColumnDef } from "@tanstack/react-table"

export interface BulkAction<TData> {
	label: string
	icon?: ReactNode
	action: (selectedRows: TData[]) => void
}

export interface FilterOption {
	column: string
	options: { label: string; value: string }[]
}

export interface DataTableProps<TData, TValue> {
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
	rowActions?: (row: TData) => ReactNode
	bulkActions?: BulkAction<TData>[]
	onAddClick?: () => void
	onExportCSV?: (data: TData[]) => void
	exportTitle?: string
	exportSheetName?: string
}

export interface PaginationState {
	pageIndex: number
	pageSize: number
}

export interface PaginatedResponse<T> {
	count: number
	next: string | null
	previous: string | null
	results: T[]
}
