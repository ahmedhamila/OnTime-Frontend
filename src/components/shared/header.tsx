
import { Theme } from "./theme"

export const Header = () => {


	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className=" h-14 flex  items-center justify-end px-12">
				<div className="flex items-center gap-2">
					<Theme />
				</div>
			</div>
		</header>
	)
}
