import type { DebugSlice, SliceCreator } from "../types";

const MAX_DEBUG_EVENTS = 500;

export const createDebugSlice: SliceCreator<DebugSlice> = (set) => ({
	lastRequest: null,
	lastResponse: null,
	debugEvents: [],

	setLastRequest: (lastRequest) => set({ lastRequest }),
	setLastResponse: (lastResponse) => set({ lastResponse }),
	addDebugEvent: (event) =>
		set((state) => {
			const nextEvent = {
				...event,
				id: crypto.randomUUID(),
				timestamp: new Date().toISOString(),
			};
			const nextEvents = [...state.debugEvents, nextEvent];
			return {
				debugEvents:
					nextEvents.length > MAX_DEBUG_EVENTS
						? nextEvents.slice(nextEvents.length - MAX_DEBUG_EVENTS)
						: nextEvents,
			};
		}),
	clearDebugEvents: () => set({ debugEvents: [] }),
});
