
export interface BalancedScopeOptions<TStartResult> {
	onStart(): TStartResult;
	onEnd(value: TStartResult): void;
}

export interface IReadonlyBalancedScope {
	isBusy(): boolean;
}

export class BalancedScope<TStartResult = void> implements IReadonlyBalancedScope {

	private startCount: number;
	private readonly onStart: () => TStartResult;
	private readonly onEnd: (value: TStartResult) => void;
	private onStartResult: TStartResult | undefined;

	constructor(options: BalancedScopeOptions<TStartResult>) {
		this.startCount = 0;
		this.onStart = options.onStart;
		this.onEnd = options.onEnd;
	}

	public start() {
		this.startCount++;
		if (this.startCount === 1) this.onStartResult = this.onStart();
	}

	public end() {
		this.startCount--;
		if (this.startCount === 0) this.onEnd(this.onStartResult!);
	}

	public isBusy(): boolean {
		return this.startCount > 0;
	}

	public async during<TPromise extends Promise<any>>(promise: TPromise) {
		try {
			this.start();
			await promise;
		} finally {
			this.end();
		}
	}
}