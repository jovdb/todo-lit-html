import { html } from "lit-html/lib/lit-extended";
import { style } from "typestyle";
import { getTheme } from "../theme";
import { BaseComponent } from "./BaseComponent";

export class Header extends BaseComponent {

	private content: any;
	private readonly rootClassName: string;

	constructor(content: any) {
		super();
		this.content = content;
		this.rootClassName = this.getStyle();
	}

	protected getStyle() {

		const theme = getTheme(true);
		return style({
			$debugName: "header",
			backgroundColor: theme.primaryColor,
			color: theme.lightColor,
			fontFamily: theme.fontFamily,
			fontSize: theme.fontSize * 2,
			padding: theme.fontSize / 2
		});
	}

	protected getTemplate() {
		return html`<div class$="${this.rootClassName}">${this.content}</div>`;
	}
}