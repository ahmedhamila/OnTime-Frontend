import React, { useCallback, useMemo, useState } from "react"

import { Checkbox } from "@/components/ui/checkbox"
import {
	ColumnDef,
	ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	OnChangeFn,
	SortingState,
	useReactTable,
	VisibilityState
} from "@tanstack/react-table"

interface UseDataTableProps<TData, TValue> {
	data: TData[]
	columns: ColumnDef<TData, TValue>[]
	enablePagination?: boolean
	pageSize?: number
	enableRowSelection?: boolean
	rowActions?: (row: TData) => React.ReactNode
	manualPagination: boolean
	manualSorting?: boolean
	sorting?: SortingState
	onSortingChange?: (sorting: SortingState) => void
	enableSorting?: boolean
	filterableColumns?: string[]
	enableGlobalFiltering?: boolean
}

export function useDataTable<TData, TValue>({
	data,
	columns,
	enablePagination,
	pageSize,
	enableRowSelection,
	rowActions,
	manualPagination,
	manualSorting,
	sorting: externalSorting,
	onSortingChange,
	enableSorting,
	filterableColumns,
	enableGlobalFiltering
}: UseDataTableProps<TData, TValue>) {
	const [internalSorting, setInternalSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const [filterValues, setFilterValues] = useState<Record<string, string>>({})

	const processedColumns = useMemo(() => {
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

	const handleSortingChange: OnChangeFn<SortingState> = useCallback(
		(updater) => {
			const newSorting =
				typeof updater === "function" ? updater(internalSorting) : updater

			if (manualSorting) {
				onSortingChange?.(newSorting)
			} else {
				setInternalSorting(newSorting)
			}
		},
		[manualSorting, onSortingChange, internalSorting]
	)

	const table = useReactTable({
		data,
		columns: processedColumns,
		onSortingChange: handleSortingChange,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting: manualSorting ? externalSorting : internalSorting,
			columnFilters,
			columnVisibility,
			rowSelection
		},
		initialState: {
			pagination: {
				pageSize: enablePagination ? pageSize : data.length
			}
		},
		manualPagination,
		manualSorting,
		enableSorting
	})

	const applyFilter = useCallback(
		(column: string, value: string) => {
			const isColumnFilterable = filterableColumns?.some(
				(fc) => column.startsWith(fc) || column.includes(fc)
			)

			if (enableGlobalFiltering || isColumnFilterable) {
				setFilterValues((prev) => ({
					...prev,
					[column]: value
				}))
				// For nested paths, we need to ensure we're getting the correct column
				const tableColumn = table
					.getAllColumns()
					.find((col) => col.id === column)
				if (tableColumn) {
					tableColumn.setFilterValue(value)
				}
			}
		},
		[table, filterableColumns, enableGlobalFiltering]
	)

	const clearFilter = useCallback(
		(column: string) => {
			const isColumnFilterable = filterableColumns?.some(
				(fc) => column.startsWith(fc) || column.includes(fc)
			)

			if (enableGlobalFiltering || isColumnFilterable) {
				setFilterValues((prev) => {
					const newFilters = { ...prev }
					delete newFilters[column]
					return newFilters
				})
				// For nested paths, we need to ensure we're getting the correct column
				const tableColumn = table
					.getAllColumns()
					.find((col) => col.id === column)
				if (tableColumn) {
					tableColumn.setFilterValue(undefined)
				}
			}
		},
		[table, filterableColumns, enableGlobalFiltering]
	)

	return {
		table,
		filterValues,
		setFilterValues,
		applyFilter,
		clearFilter
	}
}
