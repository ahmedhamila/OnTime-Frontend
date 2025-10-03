import { Separator } from "@/components/ui/separator"
import { PasswordForm } from "@/modules/account/components/PasswordForm"

export default function PasswordPage() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-medium">Mot de passe</h2>
				<p className="text-sm text-muted-foreground">
					Mettez à jour votre mot de passe
				</p>
			</div>
			<Separator />
			<PasswordForm />
		</div>
	)
}
