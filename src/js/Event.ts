export type Unsubscribe = () => void;
export type EventCallback<T> = (payload: T) => void;

export interface IReadonlyEvent<T> {
	subscribe(cb: EventCallback<T>): Unsubscribe;
}

export class Event<T> implements IReadonlyEvent<T> {

	private callbacks: EventCallback<T>[];

	constructor() {
		this.callbacks = [];
	}

	public subscribe(callback: EventCallback<T>): Unsubscribe {
		const callbackCopy = function eventCallback(payload: T) {
			callback(payload);
		};
		this.callbacks.push(callbackCopy);

		return () => {
			const index = this.callbacks.indexOf(callbackCopy);
			if (index >= 0) this.callbacks.splice(index, 1);
		};
	}

	public publish(payload: T) {
		for (const callback of this.callbacks) { // Contra: order of subscriptions matters
			callback(payload);
		}
	}
}