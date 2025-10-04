"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Clock } from "@/modules/employee/types/clock"
import { ClockIcon, ExternalLink, MapPin, Phone, UserCheck } from "lucide-react"
import { toast } from "sonner"

interface CurrentlyActiveEmployeesProps {
	activeEmployees: Array<{ employee: Clock["employee"]; lastClock: Clock }>
}

export function CurrentlyActiveEmployees({
	activeEmployees
}: CurrentlyActiveEmployeesProps) {
	if (activeEmployees.length === 0) {
		return (
			<Card className="p-12 text-center">
				<UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">Aucun employé présent</h3>
				<p className="text-muted-foreground text-sm">
					Les employés actuellement présents apparaîtront ici
				</p>
			</Card>
		)
	}

	// Sort by last clock time descending
	const sortedActive = [...activeEmployees].sort(
		(a, b) =>
			new Date(b.lastClock.timestamp).getTime() -
			new Date(a.lastClock.timestamp).getTime()
	)

	const calculateDuration = (clockInTime: string) => {
		const now = new Date()
		const clockIn = new Date(clockInTime)
		const diffMs = now.getTime() - clockIn.getTime()
		const hours = Math.floor(diffMs / (1000 * 60 * 60))
		const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
		return `${hours}h ${minutes}m`
	}

	return (
		<Card className="p-4 sm:p-6">
			<div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
				<h2 className="text-lg sm:text-xl font-semibold">
					Employés Actuellement Présents
				</h2>
				<Badge variant="default" className="bg-green-600 shrink-0">
					{activeEmployees.length} présent
					{activeEmployees.length > 1 ? "s" : ""}
				</Badge>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{sortedActive.map(({ employee, lastClock }) => {
					const initials = `${employee.firstName[0]}${employee.lastName[0]}`
					const clockInTime = new Date(lastClock.timestamp).toLocaleTimeString(
						"fr-FR",
						{
							hour: "2-digit",
							minute: "2-digit",
							timeZone: "Europe/Paris"
						}
					)
					const duration = calculateDuration(lastClock.timestamp)
					const mapsUrl = `https://www.google.com/maps?q=${lastClock.locationLat},${lastClock.locationLng}`

					return (
						<Card
							key={employee.id}
							className="p-4 border-green-200 dark:border-green-900"
						>
							<div className="flex items-start gap-3">
								<Avatar className="h-12 w-12 shrink-0">
									<AvatarImage
										src={lastClock.photo || "/placeholder.svg"}
										alt={`${employee.firstName} ${employee.lastName}`}
									/>
									<AvatarFallback>{initials}</AvatarFallback>
								</Avatar>

								<div className="flex-1 min-w-0">
									<p className="font-semibold truncate">
										{employee.firstName} {employee.lastName}
									</p>

									<div className="space-y-1 mt-2 text-sm text-muted-foreground">
										<div className="flex items-center gap-1">
											<ClockIcon className="h-3 w-3 shrink-0" />
											<span className="truncate">Entrée: {clockInTime}</span>
										</div>
										<div className="flex items-center gap-1">
											<UserCheck className="h-3 w-3 text-green-600 shrink-0" />
											<span className="text-green-600 font-medium">
												{duration}
											</span>
										</div>
										<div className="flex items-center gap-1">
											<MapPin className="h-3 w-3 shrink-0" />
											<span className="truncate text-xs">
												{lastClock.locationLat.toFixed(4)},{" "}
												{lastClock.locationLng.toFixed(4)}
											</span>
										</div>
									</div>

									<div className="flex flex-col gap-2 mt-3">
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-full justify-start"
											onClick={() => {
												navigator.clipboard.writeText(employee.phoneNumber)
												toast.success("Téléphone copié")
											}}
										>
											<Phone className="h-3 w-3 mr-1 shrink-0" />
											<span className="truncate">{employee.phoneNumber}</span>
										</Button>

										<Button
											variant="outline"
											size="sm"
											className="h-8 w-full justify-start bg-transparent"
											asChild
										>
											<a
												href={mapsUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												<MapPin className="h-3 w-3 mr-1 shrink-0" />
												Voir sur carte
												<ExternalLink className="h-3 w-3 ml-auto shrink-0" />
											</a>
										</Button>
									</div>
								</div>
							</div>
						</Card>
					)
				})}
			</div>
		</Card>
	)
}
