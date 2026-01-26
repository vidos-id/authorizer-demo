import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/stores/appStore";
import { CredentialSetBuilder } from "./CredentialSetBuilder";

export function CredentialSetList() {
	const credentialSets = useAppStore((state) => state.credentialSets);
	const addCredentialSet = useAppStore((state) => state.addCredentialSet);
	const removeCredentialSet = useAppStore((state) => state.removeCredentialSet);

	return (
		<div className="space-y-4 md:space-y-6">
			<Label>Credential Sets (DCQL)</Label>

			{credentialSets.length === 0 ? (
				<div className="p-6 border rounded-md border-dashed text-center">
					<p className="text-sm text-muted-foreground mb-4">
						(optional)
						<br />
						Add a credential set to request credentials with more complex OR and
						AND logic using DCQL.
					</p>
					<Button type="button" variant="outline" onClick={addCredentialSet}>
						<Plus className="h-4 w-4 mr-2" />
						Add Credential Set
					</Button>
				</div>
			) : (
				<>
					<div className="space-y-2">
						{credentialSets.map((set, index) => (
							<CredentialSetItem
								key={set.reactKey}
								setId={set.id}
								defaultOpen={index === 0}
								onRemove={removeCredentialSet}
							/>
						))}
					</div>
					<Separator className="my-4" />
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addCredentialSet}
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Credential Set
					</Button>
				</>
			)}
		</div>
	);
}

// Individual credential set item with its own open state
interface CredentialSetItemProps {
	setId: string;
	defaultOpen: boolean;
	onRemove: (id: string) => void;
}

function CredentialSetItem({
	setId,
	defaultOpen,
	onRemove,
}: CredentialSetItemProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const credentialSets = useAppStore((state) => state.credentialSets);
	const set = credentialSets.find((s) => s.id === setId);

	if (!set) return null;

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<div className="border rounded-md" data-credential-set-id={set.id}>
				<div className="flex items-center gap-2 p-2">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8 shrink-0"
						onClick={(e) => {
							e.stopPropagation();
							onRemove(set.id);
						}}
					>
						<Trash2 className="h-4 w-4 text-destructive" />
					</Button>
					<CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left hover:bg-accent/50 rounded px-2 py-2 transition-colors">
						<ChevronRight
							className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
						/>
						<div className="flex flex-col items-start gap-0.5 flex-1">
							<span className="text-sm font-medium">Credential Set</span>
							<span className="text-xs font-mono text-muted-foreground">
								{set.id}
							</span>
						</div>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent>
					<div className="px-4 pb-4 pt-2 border-t">
						<CredentialSetBuilder set={set} />
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
}
