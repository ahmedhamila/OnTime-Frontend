import * as XLSX from "xlsx"

export const exportToCSV = async (
	data: any[],
	title = "ExportedData",
	sheetName = "Sheet1"
) => {
	try {
		if (!data || !Array.isArray(data) || data.length === 0) {
			console.error("No data provided for export.")
			return
		}

		const workbook = XLSX.utils.book_new()
		const worksheet = XLSX.utils.json_to_sheet(data)
		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
		XLSX.writeFile(workbook, `${title}.xlsx`)
	} catch (error) {
		console.error("Error exporting data to CSV:", error)
	}
}
