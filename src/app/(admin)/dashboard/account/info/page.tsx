import { Separator } from "@/components/ui/separator"
import { AccountInfoForm } from "@/modules/account/components/AccountInfoForm"

export default function AccountInfoPage() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-medium">Informations du base</h2>
				<p className="text-sm text-muted-foreground">
					Mettez à jour vos informations personnelles
				</p>
			</div>
			<Separator />
			<AccountInfoForm />
		</div>
	)
}
