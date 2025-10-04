"use client"

import { useMemo, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select"
import type { Clock } from "@/modules/employee/types/clock"
import type { Employee } from "@/modules/employee/types/employee"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
	CalendarIcon,
	ChevronLeft,
	ChevronRight,
	ClockIcon,
	ExternalLink,
	Filter,
	MapPin
} from "lucide-react"

interface FilteredClocksListProps {
	clocks: Clock[]
	employees: Employee[]
}

export function FilteredClocksList({
	clocks,
	employees
}: FilteredClocksListProps) {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all")

	// Filter clocks by selected date
	const filteredClocks = useMemo(() => {
		if (!clocks) return []

		const dateStart = new Date(selectedDate)
		dateStart.setHours(0, 0, 0, 0)

		const dateEnd = new Date(selectedDate)
		dateEnd.setHours(23, 59, 59, 999)

		let filtered = clocks.filter((clock) => {
			const clockDate = new Date(clock.timestamp)
			return clockDate >= dateStart && clockDate <= dateEnd
		})

		// Apply employee filter if selected
		if (selectedEmployeeId !== "all") {
			filtered = filtered.filter(
				(clock) => clock.employee.id === Number(selectedEmployeeId)
			)
		}

		return filtered
	}, [clocks, selectedDate, selectedEmployeeId])

	// Sort by timestamp descending (most recent first)
	const sortedClocks = useMemo(
		() =>
			[...filteredClocks].sort(
				(a, b) =>
					new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
			),
		[filteredClocks]
	)

	// Navigate to previous day
	const goToPreviousDay = () => {
		const newDate = new Date(selectedDate)
		newDate.setDate(newDate.getDate() - 1)
		setSelectedDate(newDate)
	}

	// Navigate to next day (but not future)
	const goToNextDay = () => {
		const newDate = new Date(selectedDate)
		newDate.setDate(newDate.getDate() + 1)
		const today = new Date()
		today.setHours(23, 59, 59, 999)
		if (newDate <= today) {
			setSelectedDate(newDate)
		}
	}

	// Check if selected date is today
	const isToday = useMemo(() => {
		const today = new Date()
		return (
			selectedDate.getDate() === today.getDate() &&
			selectedDate.getMonth() === today.getMonth() &&
			selectedDate.getFullYear() === today.getFullYear()
		)
	}, [selectedDate])

	// Check if next day button should be disabled
	const isNextDayDisabled = useMemo(() => {
		const nextDay = new Date(selectedDate)
		nextDay.setDate(nextDay.getDate() + 1)
		const today = new Date()
		today.setHours(23, 59, 59, 999)
		return nextDay > today
	}, [selectedDate])

	// Calculate statistics for the selected date/employee
	const stats = useMemo(() => {
		const clockIns = filteredClocks.filter((c) => c.clockType === "in").length
		const clockOuts = filteredClocks.filter((c) => c.clockType === "out").length
		const uniqueEmployees = new Set(filteredClocks.map((c) => c.employee.id))
			.size

		return {
			total: filteredClocks.length,
			clockIns,
			clockOuts,
			uniqueEmployees
		}
	}, [filteredClocks])

	return (
		<div className="space-y-4">
			{/* Filters */}
			<Card className="p-4">
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="flex items-center gap-2">
						<Filter className="h-5 w-5 text-muted-foreground" />
						<span className="font-semibold">Filtres</span>
					</div>

					<div className="flex flex-col lg:flex-row gap-3">
						{/* Date Navigation */}
						<div className="flex items-center gap-2 flex-wrap">
							<Button
								variant="outline"
								size="icon"
								onClick={goToPreviousDay}
								className="shrink-0 bg-transparent"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>

							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="min-w-[180px] justify-start text-left font-normal bg-transparent"
									>
										<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
										<span className="truncate">
											{format(selectedDate, "PPP", { locale: fr })}
										</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={selectedDate}
										onSelect={(date) => date && setSelectedDate(date)}
										disabled={(date) => date > new Date()}
										initialFocus
										locale={fr}
									/>
								</PopoverContent>
							</Popover>

							<Button
								variant="outline"
								size="icon"
								onClick={goToNextDay}
								disabled={isNextDayDisabled}
								className="shrink-0 bg-transparent"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>

							{!isToday && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSelectedDate(new Date())}
									className="shrink-0"
								>
									Aujourd&apos;hui
								</Button>
							)}
						</div>

						{/* Employee Filter */}
						<Select
							value={selectedEmployeeId}
							onValueChange={setSelectedEmployeeId}
						>
							<SelectTrigger className="w-full lg:w-[200px]">
								<SelectValue placeholder="Tous les employés" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tous les employés</SelectItem>
								{employees?.map((employee) => (
									<SelectItem key={employee.id} value={employee.id.toString()}>
										{employee.firstName} {employee.lastName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Statistics */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t">
					<div>
						<p className="text-xs text-muted-foreground">Total</p>
						<p className="text-xl font-bold">{stats.total}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Entrées</p>
						<p className="text-xl font-bold text-green-600">{stats.clockIns}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Sorties</p>
						<p className="text-xl font-bold text-orange-600">
							{stats.clockOuts}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Employés</p>
						<p className="text-xl font-bold">{stats.uniqueEmployees}</p>
					</div>
				</div>
			</Card>

			{/* Clocks List */}
			{sortedClocks.length === 0 ? (
				<Card className="p-12 text-center">
					<ClockIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
					<h3 className="text-lg font-semibold mb-2">Aucun pointage trouvé</h3>
					<p className="text-muted-foreground text-sm">
						{selectedEmployeeId === "all"
							? "Aucun pointage pour cette date"
							: "Aucun pointage pour cet employé à cette date"}
					</p>
				</Card>
			) : (
				<Card className="p-4 sm:p-6">
					<div className="flex items-center justify-between mb-4 gap-2">
						<h2 className="text-lg sm:text-xl font-semibold">Pointages</h2>
						<Badge variant="secondary">{sortedClocks.length} pointages</Badge>
					</div>

					<ScrollArea className="h-[600px] pr-2 sm:pr-4">
						<div className="space-y-3">
							{sortedClocks.map((clock) => {
								const initials = `${clock.employee.firstName[0]}${clock.employee.lastName[0]}`
								const clockTime = new Date(clock.timestamp).toLocaleTimeString(
									"fr-FR",
									{
										hour: "2-digit",
										minute: "2-digit",
										timeZone: "Europe/Paris"
									}
								)
								const mapsUrl = `https://www.google.com/maps?q=${clock.locationLat},${clock.locationLng}`

								return (
									<Card
										key={clock.id}
										className="p-3 sm:p-4 hover:bg-accent/50 transition-colors"
									>
										<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
											<Avatar className="h-12 w-12 shrink-0">
												<AvatarImage
													src={clock.photo || "/placeholder.svg"}
													alt={`${clock.employee.firstName} ${clock.employee.lastName}`}
												/>
												<AvatarFallback>{initials}</AvatarFallback>
											</Avatar>

											<div className="flex-1 min-w-0 w-full">
												<div className="flex items-center gap-2 mb-1 flex-wrap">
													<p className="font-semibold truncate">
														{clock.employee.firstName} {clock.employee.lastName}
													</p>
													<Badge
														variant={
															clock.clockType === "in" ? "default" : "secondary"
														}
														className="shrink-0"
													>
														{clock.clockType === "in" ? "Entrée" : "Sortie"}
													</Badge>
												</div>

												<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
													<div className="flex items-center gap-1">
														<ClockIcon className="h-3 w-3 shrink-0" />
														<span>{clockTime}</span>
													</div>
													<div className="flex items-center gap-1 min-w-0">
														<MapPin className="h-3 w-3 shrink-0" />
														<span className="truncate">
															{clock.locationLat.toFixed(4)},{" "}
															{clock.locationLng.toFixed(4)}
														</span>
													</div>
												</div>
											</div>

											<Button
												variant="outline"
												size="sm"
												className="w-full sm:w-auto shrink-0 bg-transparent"
												asChild
											>
												<a
													href={mapsUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													<MapPin className="h-3 w-3 mr-1" />
													Voir sur carte
													<ExternalLink className="h-3 w-3 ml-1" />
												</a>
											</Button>
										</div>
									</Card>
								)
							})}
						</div>
					</ScrollArea>
				</Card>
			)}
		</div>
	)
}
