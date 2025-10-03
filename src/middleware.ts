import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export default async function middleware(req: NextRequest) {
	const token = await getToken({ req })
	const isAuth = !!token

	const { pathname } = req.nextUrl

	// Pages that do not require authentication
	const publicPaths = ["/login", "/clock-in", "/clock-out"]

	const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

	// If user is authenticated and tries to access /login → redirect to /dashboard
	if (pathname.startsWith("/login") && isAuth) {
		return NextResponse.redirect(new URL("/dashboard", req.url))
	}

	// If route starts with /admin and user is not authenticated → redirect to /login
	if (pathname.startsWith("/dashboard") && !isAuth) {
		return NextResponse.redirect(new URL("/login", req.url))
	}

	// Otherwise, allow access
	return NextResponse.next()
}

export const config = {
	matcher: [
		"/login",
		"/dashboard/:path*" // Protect all admin routes
	]
}
