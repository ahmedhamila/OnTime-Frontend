/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: process.env.NEXT_PUBLIC_BACKEND_PROTOCOL,
				hostname: process.env.NEXT_PUBLIC_BACKEND_DOMAIN,
				pathname: process.env.NEXT_PUBLIC_BACKEND_PATHNAME
			}
		]
	},
	reactStrictMode: true
}

export default nextConfig
