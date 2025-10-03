export const exportToCSV = <TData extends Record<string, any>>(
	data: TData[],
	filename: string = "exported-data"
) => {
	if (!data.length) return

	
	const headers = Object.keys(data[0])

	
	const csvContent = [
		headers.join(","), 
		...data.map((row) =>
			headers
				.map((header) => {
					const cell = row[header]
					
					if (typeof cell === "string" && cell.includes(",")) {
						return `"${cell}"`
					}
					return cell
				})
				.join(",")
		)
	].join("\n")

	
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
	const link = document.createElement("a")
	const url = URL.createObjectURL(blob)

	link.setAttribute("href", url)
	link.setAttribute("download", `${filename}.csv`)
	link.style.visibility = "hidden"

	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}
