import { Unsubscribe } from "./Event";

export function blockInputEvents(): Unsubscribe {

	const eventNames: (keyof WindowEventMap)[] = [
		"click",
		"dblclick",

		"drag",
		"dragstart",
		"dragend",
		"drop",

		"keydown",
		"keyup",
		"keypress",

		"mousedown",
		"mouseenter",
		"mousemove",
		"mouseup",

		"pointerdown",
		"pointerenter",
		"pointermove",
		"pointerup",

		"input",
		"select",
		"submit",

		"touchstart",
		"touchmove",
		"touchend",
		"touchcancel",

		"wheel"
	];

	function stopPropagationHandler(e: Event) {
		if (e && e.stopPropagation) e.stopPropagation();
		if (e && e.preventDefault) e.preventDefault();
	}

	// Register
	for (const eventName of eventNames) {
		window.addEventListener(eventName, stopPropagationHandler, true);
	}

	return () => {

		// Unregister
		for (const eventName of eventNames) {
			window.removeEventListener(eventName, stopPropagationHandler, true);
		}
	};
}