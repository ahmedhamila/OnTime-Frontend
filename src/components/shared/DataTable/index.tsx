import { cn } from "@/lib/utils"
import { SortingState } from "@tanstack/react-table"

import { DataTableContent } from "./DataTableContent"
import { DataTablePagination } from "./DataTablePagination"
import { DataTableServerPagination } from "./DataTableServerPagination"
import { DataTableToolbar } from "./DataTableToolbar"
import { useDataTable } from "./hooks/useDataTable"
import { DataTableProps, PaginationState } from "./types"

interface ExtendedDataTableProps<TData, TValue>
	extends DataTableProps<TData, TValue> {
	serverSidePagination?: boolean
	totalItems?: number
	pagination?: PaginationState
	onPaginationChange?: (pagination: PaginationState) => void
	sorting?: SortingState
	onSortingChange?: (sorting: SortingState) => void
	manualSorting?: boolean
	filterableColumns?: string[]
	enableGlobalFiltering?: boolean
	onRowDoubleClick?: (row: TData) => void
	enableSearch?: boolean
	searchValue?: string
	onSearchChange?: (value: string) => void
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
	exportSheetName = "Sheet1",
	serverSidePagination = false,
	totalItems,
	pagination,
	onPaginationChange,
	sorting,
	onSortingChange,
	manualSorting = false,
	filterableColumns,
	enableGlobalFiltering = false,
	onRowDoubleClick,
	enableSearch = false,
	searchValue,
	onSearchChange
}: ExtendedDataTableProps<TData, TValue>) {
	const { table, filterValues, applyFilter, clearFilter } = useDataTable({
		data,
		columns,
		enablePagination: enablePagination && !serverSidePagination,
		pageSize,
		enableRowSelection,
		rowActions,
		manualPagination: serverSidePagination,
		manualSorting: serverSidePagination || manualSorting,
		sorting,
		onSortingChange,
		enableSorting,
		filterableColumns,
		enableGlobalFiltering
	})

	return (
		<div className={cn("w-full overflow-hidden", className)}>
			<DataTableToolbar
				data={data}
				table={table}
				filterOptions={filterOptions}
				onAddClick={onAddClick}
				onExportCSV={onExportCSV}
				exportTitle={exportTitle}
				exportSheetName={exportSheetName}
				enableColumnVisibility={enableColumnVisibility}
				enableSearch={enableSearch}
				searchValue={searchValue}
				onSearch={onSearchChange}
			/>

			<DataTableContent
				table={table}
				enableSorting={enableSorting}
				enableFiltering={enableFiltering}
				filterValues={filterValues}
				onFilterApply={applyFilter}
				onFilterClear={clearFilter}
				filterableColumns={filterableColumns}
				enableGlobalFiltering={enableGlobalFiltering}
				onRowDoubleClick={onRowDoubleClick}
			/>

			{enablePagination &&
				(serverSidePagination ? (
					<DataTableServerPagination
						table={table}
						pageSizeOptions={pageSizeOptions}
						enableRowSelection={enableRowSelection}
						bulkActions={bulkActions}
						pagination={pagination!}
						totalItems={totalItems!}
						onPaginationChange={onPaginationChange!}
					/>
				) : (
					<DataTablePagination
						table={table}
						pageSizeOptions={pageSizeOptions}
						enableRowSelection={enableRowSelection}
						bulkActions={bulkActions}
					/>
				))}
		</div>
	)
}
