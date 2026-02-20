import { Bug, ChevronDown, GripHorizontal, Trash2 } from "lucide-react";
import {
	type MouseEvent as ReactMouseEvent,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { PrettyJson } from "@/components/ui/PrettyJson";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/appStore";
import {
	DEBUG_EVENT_META,
	DEBUG_OPERATION_LABELS,
	type DebugEvent,
	type DebugEventType,
	type DebugLevel,
} from "@/types/debug";

const STORAGE_KEYS = {
	expanded: "debug-console-expanded",
	bottomSize: "debug-console-bottom-size",
	offsetRight: "debug-console-offset-right",
} as const;

const DEFAULT_LEVEL_VISIBILITY: Record<DebugLevel, boolean> = {
	info: true,
	warn: true,
	error: true,
	debug: false,
};

const DEFAULT_TYPE_VISIBILITY: Record<DebugEventType, boolean> = {
	vidos_request: true,
	vidos_response: true,
	error: true,
};

const PANEL_WIDTH = 900;

export function PersistentDebugConsole() {
	const events = useAppStore((state) => state.debugEvents);
	const clearDebugEvents = useAppStore((state) => state.clearDebugEvents);

	const [isExpanded, setIsExpanded] = useState(() => {
		if (typeof window === "undefined") return false;
		return localStorage.getItem(STORAGE_KEYS.expanded) === "true";
	});
	const [bottomSize, setBottomSize] = useState(() => {
		if (typeof window === "undefined") return 320;
		const stored = Number(localStorage.getItem(STORAGE_KEYS.bottomSize));
		if (Number.isFinite(stored) && stored >= 220 && stored <= 680) {
			return stored;
		}
		return 320;
	});
	const [offsetRight, setOffsetRight] = useState(() => {
		if (typeof window === "undefined") return 16;
		const stored = Number(localStorage.getItem(STORAGE_KEYS.offsetRight));
		return Number.isFinite(stored) && stored >= 0 ? stored : 16;
	});
	const [levelVisibility, setLevelVisibility] = useState(
		DEFAULT_LEVEL_VISIBILITY,
	);
	const [typeVisibility, setTypeVisibility] = useState(DEFAULT_TYPE_VISIBILITY);
	const [selectedEvent, setSelectedEvent] = useState<DebugEvent | null>(null);

	const listRef = useRef<HTMLDivElement | null>(null);
	const resizingRef = useRef(false);
	const draggingRef = useRef(false);
	const dragStartXRef = useRef(0);
	const dragStartOffsetRef = useRef(0);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.expanded, String(isExpanded));
	}, [isExpanded]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.bottomSize, String(bottomSize));
	}, [bottomSize]);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEYS.offsetRight, String(offsetRight));
	}, [offsetRight]);

	const visibleEvents = useMemo(() => {
		return events.filter(
			(event) =>
				levelVisibility[event.level] && typeVisibility[event.eventType],
		);
	}, [events, levelVisibility, typeVisibility]);

	useEffect(() => {
		if (!isExpanded || visibleEvents.length === 0) return;
		const list = listRef.current;
		if (!list) return;
		list.scrollTop = list.scrollHeight;
	}, [isExpanded, visibleEvents]);

	useEffect(() => {
		const handleMouseMove = (event: MouseEvent) => {
			if (resizingRef.current) {
				const maxBottomSize = Math.min(680, window.innerHeight - 120);
				const next = window.innerHeight - event.clientY;
				setBottomSize(Math.max(220, Math.min(maxBottomSize, next)));
				return;
			}
			if (draggingRef.current) {
				const dx = event.clientX - dragStartXRef.current;
				const rawOffset = dragStartOffsetRef.current - dx;
				const panelWidth = Math.min(PANEL_WIDTH, window.innerWidth * 0.96);
				const maxOffset = window.innerWidth - panelWidth;
				setOffsetRight(Math.max(0, Math.min(maxOffset, rawOffset)));
			}
		};

		const handleMouseUp = () => {
			if (!resizingRef.current && !draggingRef.current) {
				return;
			}
			resizingRef.current = false;
			draggingRef.current = false;
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	const startResize = (event: ReactMouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		resizingRef.current = true;
		document.body.style.userSelect = "none";
		document.body.style.cursor = "ns-resize";
	};

	const startDrag = (event: ReactMouseEvent<HTMLDivElement>) => {
		// Don't start drag if clicking on interactive children (buttons, etc.)
		const target = event.target as HTMLElement;
		if (target.closest("button")) return;

		event.preventDefault();
		draggingRef.current = true;
		dragStartXRef.current = event.clientX;
		dragStartOffsetRef.current = offsetRight;
		document.body.style.userSelect = "none";
		document.body.style.cursor = "grabbing";
	};

	const toggleLevel = (level: DebugLevel) => {
		setLevelVisibility((prev) => ({ ...prev, [level]: !prev[level] }));
	};

	const toggleType = (eventType: DebugEventType) => {
		setTypeVisibility((prev) => ({ ...prev, [eventType]: !prev[eventType] }));
	};

	return (
		<>
			<div
				className="fixed bottom-0 z-50 flex flex-col items-end"
				style={{ right: `${offsetRight}px` }}
			>
				{isExpanded && (
					<div
						className="w-[min(96vw,900px)] flex flex-col overflow-hidden rounded-t-xl border border-b-0 border-primary/30 bg-background shadow-[0_-6px_28px_rgba(0,0,0,0.16)] backdrop-blur"
						style={{ height: `${bottomSize}px` }}
					>
						<button
							type="button"
							onMouseDown={startResize}
							className="absolute -top-1 left-0 right-0 h-2 z-10 cursor-ns-resize"
							aria-label="Resize debug console"
						/>

						<div className="h-1 w-full shrink-0 bg-gradient-to-r from-primary/70 via-primary to-primary/70" />

						<div
							role="toolbar"
							onMouseDown={startDrag}
							className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border/60 bg-muted/30 shrink-0 select-none cursor-grab active:cursor-grabbing"
						>
							<div className="flex items-center gap-2.5">
								<GripHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
								<Bug className="w-4 h-4 text-primary" />
								<span className="text-sm font-semibold text-foreground font-mono uppercase tracking-wider">
									Debug Console
								</span>
								<span className="text-xs text-muted-foreground font-mono">
									{events.length} events
								</span>
							</div>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={clearDebugEvents}
								className="h-7 gap-1.5 text-xs"
							>
								<Trash2 className="h-3 w-3" />
								Clear
							</Button>
						</div>

						<div className="flex flex-1 min-h-0">
							<div className="w-44 shrink-0 flex flex-col gap-4 px-3 py-3 border-r border-border/60 bg-muted/10 overflow-y-auto">
								<div className="flex flex-col gap-1.5">
									<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
										Levels
									</span>
									{(["info", "warn", "error", "debug"] as const).map(
										(level) => (
											<button
												key={level}
												type="button"
												onClick={() => toggleLevel(level)}
												className={cn(
													"rounded-md border px-2 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors text-left",
													levelVisibility[level]
														? "border-primary/40 bg-primary/10 text-primary"
														: "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
												)}
											>
												{level}
											</button>
										),
									)}
								</div>

								<div className="flex flex-col gap-1.5">
									<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
										Types
									</span>
									{(
										Object.keys(DEFAULT_TYPE_VISIBILITY) as DebugEventType[]
									).map((eventType) => (
										<button
											key={eventType}
											type="button"
											onClick={() => toggleType(eventType)}
											className={cn(
												"rounded-md border px-2 py-1 text-[10px] font-mono transition-colors text-left",
												typeVisibility[eventType]
													? "border-primary/40 bg-primary/10 text-primary"
													: "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
											)}
											title={DEBUG_EVENT_META[eventType].description}
										>
											{DEBUG_EVENT_META[eventType].label}
										</button>
									))}
								</div>
							</div>

							<div ref={listRef} className="flex-1 overflow-y-auto p-3">
								{visibleEvents.length === 0 ? (
									<div className="flex flex-col items-center justify-center h-full text-center py-8">
										<div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-3">
											<Bug className="w-6 h-6 text-muted-foreground/40" />
										</div>
										<p className="text-sm text-muted-foreground">
											{events.length === 0
												? "No debug events yet"
												: "No events match current filters"}
										</p>
									</div>
								) : (
									<div className="space-y-1.5">
										{visibleEvents.map((event) => {
											const clickable = event.payload !== undefined;
											const operationLabel = event.operation
												? DEBUG_OPERATION_LABELS[event.operation]
												: null;

											return (
												<button
													key={event.id}
													type="button"
													className={cn(
														"w-full text-left rounded-md border border-border/60 bg-card px-2.5 py-2 hover:border-border transition-colors",
														clickable && "cursor-pointer hover:bg-muted/20",
													)}
													onClick={() => clickable && setSelectedEvent(event)}
													disabled={!clickable}
												>
													<div className="flex flex-wrap items-center gap-2 text-xs mb-1.5">
														<span className="font-mono text-muted-foreground text-[10px]">
															{new Date(event.timestamp).toLocaleTimeString()}
														</span>
														<span
															className={cn(
																"rounded px-1.5 py-0.5 font-mono uppercase text-[9px] font-bold tracking-wider",
																event.level === "error" &&
																	"bg-destructive/20 text-destructive",
																event.level === "warn" &&
																	"bg-amber-500/20 text-amber-700 dark:text-amber-400",
																event.level === "info" &&
																	"bg-blue-500/20 text-blue-700 dark:text-blue-400",
																event.level === "debug" &&
																	"bg-muted text-muted-foreground",
															)}
														>
															{event.level}
														</span>
														<span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
															{DEBUG_EVENT_META[event.eventType].label}
														</span>
														{event.eventType === "vidos_request" && (
															<span className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400 uppercase tracking-wider">
																-&gt; REQ
															</span>
														)}
														{event.eventType === "vidos_response" && (
															<span
																className={cn(
																	"rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider",
																	event.ok === false
																		? "bg-destructive/20 text-destructive"
																		: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
																)}
															>
																&lt;- RES
															</span>
														)}
														{event.method && (
															<span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
																{event.method}
															</span>
														)}
														{operationLabel && (
															<span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
																{operationLabel}
															</span>
														)}
														{event.httpStatus !== undefined && (
															<span
																className={cn(
																	"rounded px-1.5 py-0.5 font-mono text-[9px]",
																	event.ok === false
																		? "bg-destructive/20 text-destructive"
																		: "bg-green-500/20 text-green-700 dark:text-green-400",
																)}
															>
																{event.httpStatus}
															</span>
														)}
														{event.durationMs !== undefined && (
															<span className="font-mono text-[9px] text-muted-foreground">
																{event.durationMs}ms
															</span>
														)}
													</div>
													<p className="text-[11px] leading-relaxed text-foreground">
														{event.message}
													</p>
												</button>
											);
										})}
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				<button
					type="button"
					onClick={() => setIsExpanded((prev) => !prev)}
					className={cn(
						"flex items-center gap-2 font-mono text-foreground transition-all",
						isExpanded
							? "h-8 w-[min(96vw,900px)] justify-center border border-t border-primary/30 bg-background/95 backdrop-blur rounded-none px-2.5 text-[11px] hover:bg-primary/5"
							: "h-10 rounded-lg border-2 border-primary/50 bg-primary/10 px-4 text-xs shadow-md shadow-primary/10 backdrop-blur hover:border-primary/70 hover:bg-primary/15 hover:shadow-lg hover:shadow-primary/20 mb-4",
					)}
					aria-label={
						isExpanded ? "Collapse debug console" : "Open debug console"
					}
				>
					<Bug
						className={cn(
							"text-primary",
							isExpanded ? "h-3.5 w-3.5" : "h-4 w-4",
						)}
					/>
					<span className="uppercase tracking-wider font-semibold">Debug</span>
					{isExpanded ? (
						<ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
					) : events.length > 0 ? (
						<span className="ml-0.5 rounded-full bg-primary/20 border border-primary/40 px-2 py-0.5 text-[10px] font-bold text-primary">
							{events.length > 99 ? "99+" : events.length}
						</span>
					) : null}
				</button>
			</div>

			<Dialog
				open={selectedEvent !== null}
				onOpenChange={(isOpen) => {
					if (!isOpen) setSelectedEvent(null);
				}}
			>
				<DialogContent className="sm:max-w-[min(90vw,1100px)] max-h-[80vh] overflow-y-auto">
					{selectedEvent && (
						<>
							<DialogHeader className="pb-3 border-b border-border/60">
								<DialogTitle className="flex items-center gap-2.5">
									<span>{DEBUG_EVENT_META[selectedEvent.eventType].label}</span>
									{selectedEvent.operation && (
										<span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
											{DEBUG_OPERATION_LABELS[selectedEvent.operation]}
										</span>
									)}
								</DialogTitle>
							</DialogHeader>
							<div className="space-y-3 min-w-0">
								<div>
									<span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
										Message
									</span>
									<p className="text-sm text-foreground mt-1">
										{selectedEvent.message}
									</p>
								</div>
								<div>
									<span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
										Timestamp
									</span>
									<p className="text-sm text-foreground font-mono mt-1">
										{new Date(selectedEvent.timestamp).toLocaleString()}
									</p>
								</div>
								{selectedEvent.authorizationId && (
									<div>
										<span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
											Authorization ID
										</span>
										<p className="text-sm text-foreground font-mono mt-1 break-all">
											{selectedEvent.authorizationId}
										</p>
									</div>
								)}
								<div className="min-w-0">
									<span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
										Payload
									</span>
									<div className="mt-1 rounded-lg bg-muted/30 border border-border/60 text-xs overflow-hidden">
										<div className="p-3 overflow-x-auto">
											<PrettyJson data={selectedEvent.payload ?? null} />
										</div>
									</div>
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
