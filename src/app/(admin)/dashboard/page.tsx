import { redirect } from "next/navigation"

export default async function Home() {
	redirect("/dashboard/clocks")
}

export const dynamic = "force-dynamic"