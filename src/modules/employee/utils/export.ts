import type { Clock } from "@/modules/employee/types/clock"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import * as XLSX from "xlsx"

export function exportClocksToExcel(clocks: Clock[], filename: string) {
	const clocksByEmployee = clocks.reduce(
		(acc, clock) => {
			const employeeName = `${clock.employee.firstName} ${clock.employee.lastName}`
			if (!acc[employeeName]) {
				acc[employeeName] = []
			}
			acc[employeeName].push(clock)
			return acc
		},
		{} as Record<string, Clock[]>
	)

	// Sort employees alphabetically
	const sortedEmployees = Object.keys(clocksByEmployee).sort()

	// Build data with employee grouping
	const data: any[] = []

	sortedEmployees.forEach((employeeName, index) => {
		const employeeClocks = clocksByEmployee[employeeName].sort(
			(a, b) =>
				new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
		)

		// Add employee header row
		if (index > 0) {
			data.push({}) // Empty row for spacing
		}

		data.push({
			Date: `👤 ${employeeName}`,
			Heure: "",
			Type: "",
			"Score Mensuel": employeeClocks[0].employee.monthlyScore,
			"Code PIN": employeeClocks[0].employee.pinCode,
			Latitude: "",
			Longitude: "",
			"Lien Maps": ""
		})

		// Add employee's clocks
		employeeClocks.forEach((clock) => {
			data.push({
				Date: format(new Date(clock.timestamp), "dd/MM/yyyy", { locale: fr }),
				Heure: format(new Date(clock.timestamp), "HH:mm:ss", { locale: fr }),
				Type: clock.clockType === "in" ? "Entrée" : "Sortie",
				"Score Mensuel": "",
				"Code PIN": "",
				Latitude: clock.locationLat.toFixed(6),
				Longitude: clock.locationLng.toFixed(6),
				"Lien Maps": `https://www.google.com/maps?q=${clock.locationLat},${clock.locationLng}`
			})
		})
	})
	// </CHANGE>

	// Create worksheet
	const worksheet = XLSX.utils.json_to_sheet(data)

	// Set column widths
	worksheet["!cols"] = [
		{ wch: 20 }, // Date
		{ wch: 10 }, // Heure
		{ wch: 10 }, // Type
		{ wch: 12 }, // Score Mensuel
		{ wch: 10 }, // Code PIN
		{ wch: 12 }, // Latitude
		{ wch: 12 }, // Longitude
		{ wch: 50 } // Lien Maps
	]

	// Create workbook
	const workbook = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(workbook, worksheet, "Pointages")

	// Generate Excel file and trigger download
	XLSX.writeFile(workbook, `${filename}.xlsx`)
}

export function exportMonthlyClocks(clocks: Clock[], month: Date) {
	// Sort clocks by timestamp
	const sortedClocks = [...clocks].sort(
		(a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
	)

	// Group by date
	const clocksByDate = sortedClocks.reduce(
		(acc, clock) => {
			const dateKey = format(new Date(clock.timestamp), "yyyy-MM-dd")
			if (!acc[dateKey]) acc[dateKey] = []
			acc[dateKey].push(clock)
			return acc
		},
		{} as Record<string, Clock[]>
	)

	const sortedDates = Object.keys(clocksByDate).sort()

	const data: any[] = []

	sortedDates.forEach((dateKey, dayIndex) => {
		const dayClocks = clocksByDate[dateKey]

		// Add spacing between days
		if (dayIndex > 0) data.push({})

		// Add day header
		data.push({
			Date: `📅 ${format(new Date(dateKey), "EEEE dd MMMM yyyy", { locale: fr })}`,
			Heure: "",
			Type: "",
			"Score Mensuel": "",
			"Code PIN": "",
			Latitude: "",
			Longitude: "",
			"Lien Maps": ""
		})

		// Group this day's clocks by employee
		const clocksByEmployee = dayClocks.reduce(
			(acc, clock) => {
				const employeeName = `${clock.employee.firstName} ${clock.employee.lastName}`
				if (!acc[employeeName]) acc[employeeName] = []
				acc[employeeName].push(clock)
				return acc
			},
			{} as Record<string, Clock[]>
		)

		const sortedEmployees = Object.keys(clocksByEmployee).sort()

		sortedEmployees.forEach((employeeName, empIndex) => {
			const employeeClocks = clocksByEmployee[employeeName].sort(
				(a, b) =>
					new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
			)

			// Add spacing between employees
			if (empIndex > 0) data.push({})

			// Employee header row
			data.push({
				Date: `👤 ${employeeName}`,
				Heure: "",
				Type: "",
				"Score Mensuel": employeeClocks[0].employee.monthlyScore,
				"Code PIN": employeeClocks[0].employee.pinCode,
				Latitude: "",
				Longitude: "",
				"Lien Maps": ""
			})

			// Add each clock entry for this employee that day
			employeeClocks.forEach((clock) => {
				data.push({
					Date: format(new Date(clock.timestamp), "dd/MM/yyyy", { locale: fr }),
					Heure: format(new Date(clock.timestamp), "HH:mm:ss", { locale: fr }),
					Type: clock.clockType === "in" ? "Entrée" : "Sortie",
					"Score Mensuel": "",
					"Code PIN": "",
					Latitude: clock.locationLat.toFixed(6),
					Longitude: clock.locationLng.toFixed(6),
					"Lien Maps": `https://www.google.com/maps?q=${clock.locationLat},${clock.locationLng}`
				})
			})
		})
	})

	// Create worksheet
	const worksheet = XLSX.utils.json_to_sheet(data)

	// Set column widths
	worksheet["!cols"] = [
		{ wch: 20 }, // Date
		{ wch: 10 }, // Heure
		{ wch: 10 }, // Type
		{ wch: 12 }, // Score Mensuel
		{ wch: 10 }, // Code PIN
		{ wch: 12 }, // Latitude
		{ wch: 12 }, // Longitude
		{ wch: 50 } // Lien Maps
	]

	// Create workbook
	const workbook = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(workbook, worksheet, "Pointages Mensuels")

	// Save file
	const monthName = format(month, "MMMM-yyyy", { locale: fr })
	XLSX.writeFile(workbook, `pointages-${monthName}.xlsx`)
}
