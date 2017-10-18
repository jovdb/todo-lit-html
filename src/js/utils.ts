export function required<T>(value: T | null | undefined, message?: string): T {
	if (value === null || value === undefined) throw new Error(message || "Value is required");
	return value;
}

export async function waitAsync<T>(delayInMs: number, value?: T): Promise<T> {
	return new Promise<T>(resolve => {
		setTimeout(() => {
			resolve(value);
		}, delayInMs);
	});
}