import Link from "next/link"

import { Header } from "@/components/shared/header"
import { Card } from "@/components/ui/card"
import { Clock, LogIn, LogOut } from "lucide-react"

export default function HomePage() {
	return (
		<div>
			<Header />
			<div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-background">
				<div className="w-full max-w-md space-y-8">
					{/* Header */}
					<div className="text-center space-y-2">
						<div className="flex justify-center mb-4">
							<div className="w-16 h-16 rounded-full bg-card flex items-center justify-center">
								<Clock className="w-8 h-8 text-foreground" />
							</div>
						</div>
						<h1 className="text-3xl font-bold tracking-tight text-balance">
							OnTime
						</h1>
						<p className="text-muted-foreground text-balance">
							Select an option to continue
						</p>
					</div>

					{/* Action Cards */}
					<div className="space-y-4">
						{/* Clock In Card */}
						<Link href="/clock-in" className="block">
							<Card className="p-6 hover:bg-card/80 transition-colors border-2 hover:border-[var(--clock-in)] group cursor-pointer">
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 rounded-xl bg-[var(--clock-in)] flex items-center justify-center flex-shrink-0">
										<LogIn className="w-7 h-7 text-[var(--clock-in-foreground)]" />
									</div>
									<div className="flex-1">
										<h2 className="text-xl font-semibold mb-1 group-hover:text-[var(--clock-in)] transition-colors">
											Clock In
										</h2>
										<p className="text-sm text-muted-foreground">
											Start your work shift
										</p>
									</div>
								</div>
							</Card>
						</Link>

						{/* Clock Out Card */}
						<Link href="/clock-out" className="block">
							<Card className="p-6 hover:bg-card/80 transition-colors border-2 hover:border-[var(--clock-out)] group cursor-pointer">
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 rounded-xl bg-[var(--clock-out)] flex items-center justify-center flex-shrink-0">
										<LogOut className="w-7 h-7 text-[var(--clock-out-foreground)]" />
									</div>
									<div className="flex-1">
										<h2 className="text-xl font-semibold mb-1 group-hover:text-[var(--clock-out)] transition-colors">
											Clock Out
										</h2>
										<p className="text-sm text-muted-foreground">
											End your work shift
										</p>
									</div>
								</div>
							</Card>
						</Link>
					</div>

					{/* Footer */}
					<div className="text-center text-sm text-muted-foreground pt-4">
						<p>Need help? Contact your supervisor</p>
					</div>
				</div>
			</div>
		</div>
	)
}
