import { EmailLoginForm } from "@/modules/auth/components/EmailLoginForm"

export default function LoginPage() {
	return (
		<div className="flex flex-1 items-center justify-center px-4 max-w-xl mx-auto w-full">
			<EmailLoginForm />
		</div>
	)
}
