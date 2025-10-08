"use client"

import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AllClocksTable } from "@/modules/employee/components/AllClocksTable"
import { CurrentlyActiveEmployees } from "@/modules/employee/components/CurrentlyActiveEmployees"
import { FilteredClocksList } from "@/modules/employee/components/FilteredClocksList"
import { useClocks } from "@/modules/employee/hooks/useClocks"
import { useEmployees } from "@/modules/employee/hooks/useEmployees"
import type { Clock } from "@/modules/employee/types/clock"
import { exportMonthlyClocks } from "@/modules/employee/utils/export"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
	ClockIcon,
	Download,
	Filter,
	UserCheck,
	Users,
	UserX
} from "lucide-react"

function AdminClocksPage() {
	const {
		data: clocks,
		isLoading: clocksLoading,
		error: clocksError
	} = useClocks()
	const { data: employees, isLoading: employeesLoading } = useEmployees()

	// Calculate today's date range
	const todayStart = useMemo(() => {
		const date = new Date()
		date.setHours(0, 0, 0, 0)
		return date
	}, [])

	const todayEnd = useMemo(() => {
		const date = new Date()
		date.setHours(23, 59, 59, 999)
		return date
	}, [])

	// Filter today's clocks
	const todayClocks = useMemo(() => {
		if (!clocks) return []
		return clocks.filter((clock) => {
			const clockDate = new Date(clock.timestamp)
			return clockDate >= todayStart && clockDate <= todayEnd
		})
	}, [clocks, todayStart, todayEnd])

	// Calculate currently active employees (clocked in today but not clocked out)
	const currentlyActive = useMemo(() => {
		if (!todayClocks || !employees) return []

		const employeeStatusMap = new Map<
			number,
			{ employee: Clock["employee"]; lastClock: Clock }
		>()

		// Sort today's clocks by timestamp descending
		const sortedClocks = [...todayClocks].sort(
			(a, b) =>
				new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		)

		// For each employee, get their latest clock today
		sortedClocks.forEach((clock) => {
			if (!employeeStatusMap.has(clock.employee.id)) {
				employeeStatusMap.set(clock.employee.id, {
					employee: clock.employee,
					lastClock: clock
				})
			}
		})

		// Filter only those whose last clock *today* was "in"
		return Array.from(employeeStatusMap.values())
			.filter(({ lastClock }) => lastClock.clockType === "in")
			.map(({ employee, lastClock }) => ({ employee, lastClock }))
	}, [todayClocks, employees])
	const currentMonthClocks = useMemo(() => {
		if (!clocks) return []
		const now = new Date()
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
		const monthEnd = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			0,
			23,
			59,
			59,
			999
		)

		return clocks.filter((clock) => {
			const clockDate = new Date(clock.timestamp)
			return clockDate >= monthStart && clockDate <= monthEnd
		})
	}, [clocks])

	const handleMonthlyExport = () => {
		const monthName = format(new Date(), "MMMM-yyyy", { locale: fr })
		const filename = `pointages_${monthName}`
		exportMonthlyClocks(currentMonthClocks, new Date())
	}
	// Statistics
	const stats = useMemo(() => {
		const totalClocks = todayClocks.length
		const clockIns = todayClocks.filter((c) => c.clockType === "in").length
		const clockOuts = todayClocks.filter((c) => c.clockType === "out").length
		const uniqueEmployees = new Set(todayClocks.map((c) => c.employee.id)).size

		return {
			totalClocks,
			clockIns,
			clockOuts,
			uniqueEmployees,
			currentlyActive: currentlyActive.length
		}
	}, [todayClocks, currentlyActive])

	if (clocksLoading || employeesLoading) {
		return (
			<div className="space-y-6 p-6">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
					{[...Array(5)].map((_, i) => (
						<Skeleton key={i} className="h-32" />
					))}
				</div>
				<Skeleton className="h-96 w-full" />
			</div>
		)
	}

	if (clocksError) {
		return (
			<div className="p-6">
				<Card className="p-6 border-destructive">
					<p className="text-destructive">
						Une erreur s&apos;est produite: {clocksError.message}
					</p>
				</Card>
			</div>
		)
	}

	return (
		<div className="space-y-6 p-6">
			{/* Statistics Cards */}
			<div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5">
				<Card className="p-4 sm:p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs sm:text-sm font-medium text-muted-foreground">
								Pointages Aujourd&apos;hui
							</p>
							<p className="text-xl sm:text-2xl font-bold">
								{stats.totalClocks}
							</p>
						</div>
						<ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
					</div>
				</Card>

				<Card className="p-4 sm:p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs sm:text-sm font-medium text-muted-foreground">
								Entrées
							</p>
							<p className="text-xl sm:text-2xl font-bold text-green-600">
								{stats.clockIns}
							</p>
						</div>
						<UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 shrink-0" />
					</div>
				</Card>

				<Card className="p-4 sm:p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs sm:text-sm font-medium text-muted-foreground">
								Sorties
							</p>
							<p className="text-xl sm:text-2xl font-bold text-orange-600">
								{stats.clockOuts}
							</p>
						</div>
						<UserX className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 shrink-0" />
					</div>
				</Card>

				<Card className="p-4 sm:p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs sm:text-sm font-medium text-muted-foreground">
								Actuellement Présents
							</p>
							<p className="text-xl sm:text-2xl font-bold text-blue-600">
								{stats.currentlyActive}
							</p>
						</div>
						<UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 shrink-0" />
					</div>
				</Card>

				<Card className="p-4 sm:p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs sm:text-sm font-medium text-muted-foreground">
								Employés Actifs
							</p>
							<p className="text-xl sm:text-2xl font-bold">
								{stats.uniqueEmployees}
							</p>
						</div>
						<Users className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
					</div>
				</Card>
			</div>
			<div className="flex justify-end">
				<Button variant="outline" className="h-8" onClick={handleMonthlyExport}>
					<Download className="h-4 w-4 mr-2" />
					Exporter le mois ({format(new Date(), "MMMM yyyy", { locale: fr })})
				</Button>
			</div>
			{/* Main Content Tabs */}
			<Tabs defaultValue="filtered" className="space-y-4">
				<TabsList className="w-full bg-background border-b rounded-none h-12 justify-start gap-2">
					<TabsTrigger
						value="filtered"
						className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-tertiary  data-[state=active]:text-tertiary text-base"
					>
						<Filter className="h-4 w-4" />
						<span className="hidden sm:inline">Historique</span>
						<span className="sm:hidden">Hist.</span>
					</TabsTrigger>
					<TabsTrigger
						value="active"
						className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-tertiary  data-[state=active]:text-tertiary text-base"
					>
						<UserCheck className="h-4 w-4" />
						Présents ({currentlyActive.length})
					</TabsTrigger>
					<TabsTrigger
						value="all"
						className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-tertiary  data-[state=active]:text-tertiary text-base"
					>
						<ClockIcon className="h-4 w-4" />
						<span className="hidden sm:inline">Tous les Pointages</span>
						<span className="sm:hidden">Tous</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="filtered" className="space-y-4">
					<FilteredClocksList
						clocks={clocks || []}
						employees={employees || []}
					/>
				</TabsContent>

				<TabsContent value="active" className="space-y-4">
					<CurrentlyActiveEmployees activeEmployees={currentlyActive} />
				</TabsContent>

				<TabsContent value="all" className="space-y-4">
					<AllClocksTable clocks={clocks || []} />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default AdminClocksPage
