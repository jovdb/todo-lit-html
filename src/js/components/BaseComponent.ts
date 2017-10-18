/*
╭────────────────────────────────╮
│ BaseComponent                  │
├────────────────────────────────┤
│ getTemplate()                  │ returns the lit-html template
│ update()                       │ triggers a UI update
│ invalidate()                   │ batch up a UI update for the next cycle
│ getRootChildren()              │ get the root element(s) of the component
│ beforeDetach()                 │ component root element added to DOM
│ afterAttach()                  │ component root element removed from DOM
╰────────────────────────────────╯
*/

import { directive, NodePart, TemplateResult } from "lit-html";

// tslint:disable: no-unsafe-any
export abstract class BaseComponent {

	private isRerenderRequested = false;
	private nodePart: NodePart | undefined;

	protected abstract getTemplate(): TemplateResult;

	/**
	 * Update component will redraw the component synchroniously.
	 * Prefer invalidate() to request an UI update.
	 */
	public update() { // Protected by default?
		if (!this.nodePart) { throw new Error("Component must first be attached with lit-hmt with comp() function."); }
		this.nodePart.setValue(this.getTemplate());
	}

	/**
	 * Request an UI update asynchronious.
	 * Multiple requests are batched as one UI update.
	 */
	public invalidate() { // Protected by default?
		if (!this.isRerenderRequested) {
			this.isRerenderRequested = true;
			// Schedule the following as micro task, which runs before requestAnimationFrame.
			// All additional invalidate() calls before will be ignored.
			// https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
			// tslint:disable-next-line
			Promise.resolve().then(() => { // Don't use await for tslint rule: no-floating-promises (when function is async all callers must handle it)
				this.isRerenderRequested = false;
				this.update();
			});
		}
	}

	/**
	 * Set NodePart containing the component (used by comp).
	 * This is needed to do an UI update
	 */
	// @ts-ignore
	private setNodePart(nodePart: lit.NodePart) {
		this.nodePart = nodePart;
	}

	/** Called after added to DOM */
	//@ts-ignore
	// tslint:disable-next-line
	protected afterAttach(el: HTMLElement): void {
		return undefined;
	}

	/** Called before removed from DOM */
	//@ts-ignore
	// tslint:disable-next-line
	protected beforeDetach(el: HTMLElement): void {
		return undefined;
	}

	protected getRootChildren(): HTMLElement[] {
		if (!this.nodePart) { throw new Error("Component must first be attached with lit-hmt with comp() function."); }

		const children: HTMLElement[] = [];
		let nextSibling: any = this.nodePart.startNode && (this.nodePart.startNode as any).nextSibling;
		while (nextSibling) {
			children.push(nextSibling);
			nextSibling = nextSibling.nextSibling;
		}

		return children;
	}

}


/**
 * Lit directive to add a 'Component'.
 */
export function comp(component: BaseComponent) {
	return directive((part: any) => {

		// patch NodePart to know when added to DOM or removed from DOM
		const comp: any = component; // as any to be able to acces the protected members

		const clear = part.clear;
		part.clear = function patchedClear(startNode: Node = part.startNode) {
			let node = startNode.nextSibling;
			while (node && node !== part.endNode) {
				comp.beforeDetach(node);
				node = node.nextSibling;
			}
			clear.call(part, startNode);
		};

		const insert = part._insert;
		part._insert = function patchedInsert(node: Node) {
			const el = node.firstChild;
			insert.call(part, node);
			if (el) comp.afterAttach(el);
		};

		comp.setNodePart((part as NodePart));
		return comp.getTemplate();
	});
}
