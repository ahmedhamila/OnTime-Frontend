import { getServerSession, type AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { apiAdmin } from "./helpers/apiHelpers"

export const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			id: "email-login",
			name: "Connexion par Email",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Mot de passe", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error(
						"Veuillez saisir à la fois l'email et le mot de passe"
					)
				}

				try {
					const response = await apiAdmin.post("/api/users/login-email/", {
						email: credentials.email,
						password: credentials.password
					})

					if (response.data) {
						return {
							id: response.data.id,
							accessToken: response.data.access,
							refreshToken: response.data.refresh
						}
					}

					throw new Error("Email ou mot de passe invalide")
				} catch (error: any) {
					console.error("Error:", JSON.stringify(error, null, 2))
					if (error.response?.status === 401) {
						throw new Error("Email ou mot de passe invalide")
					}
					if (error.response?.status === 429) {
						throw new Error("Trop de tentatives. Veuillez réessayer plus tard")
					}
					throw new Error(
						"Impossible de se connecter au serveur. Veuillez réessayer"
					)
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = user.accessToken
				token.refreshToken = user.refreshToken
			}
			return token
		},
		async session({ session, token }) {
			session.user.accessToken = token.accessToken as string
			session.user.refreshToken = token.refreshToken as string
			return session
		}
	},
	pages: {
		signIn: "/login"
	},
	session: {
		strategy: "jwt"
	}
}

export const getSession = () => getServerSession(authOptions)
