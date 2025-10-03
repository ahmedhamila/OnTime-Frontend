import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"

interface AvatarUploadProps {
	currentAvatar?: string
	onFileSelect: (file: File) => void
}

export function AvatarUpload({
	currentAvatar,
	onFileSelect
}: AvatarUploadProps) {
	const fileInputRef = React.useRef<HTMLInputElement>(null)

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			onFileSelect(file)
		}
	}
	return (
		<div className="flex items-center space-x-4">
			<Avatar className="h-24 w-24">
				<AvatarImage src={currentAvatar} alt="Avatar" />
				<AvatarFallback>AJ</AvatarFallback>
			</Avatar>
			<div>
				<Button
					type="button"
					variant="outline"
					onClick={() => fileInputRef.current?.click()}
				>
					<UploadCloud className="mr-2 h-4 w-4" />
					Changer l&apos;Image
				</Button>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					accept="image/*"
					className="hidden"
				/>
			</div>
		</div>
	)
}
