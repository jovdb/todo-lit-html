import { keyframes, style } from "typestyle/lib";
import { ITodoItem } from "../models/ITodoItem";
import { ITodoList } from "../models/ITodoList";
import { button, getTheme } from "../theme";
import { BaseComponent } from "./BaseComponent";

export interface TodoListCallbacks {
	onAddClick(list: ITodoList, item: ITodoItem): Promise<void>;
	onRemoveClick(list: ITodoList, item: ITodoItem): Promise<void>;
	onCompleteClick(data: ITodoItem): Promise<void>;
}

/**
 * Created a Base Class to hold common stuff
 * Reason: I want to derive  a version that uses RxJS and Sodium
 */
export abstract class TodoListBase extends BaseComponent {

	protected readonly callbacks: TodoListCallbacks;
	protected readonly rootClassName: string;

	constructor(callbacks: TodoListCallbacks) {
		super();
		this.callbacks = callbacks;
		this.rootClassName = this.getStyle();
	}

	protected getStyle() {
		const theme = getTheme(true);
		const namePadding = "6px";

		const spinAnimationName = keyframes({
			"0%": {
				transform: "rotate(0)"
			},
			"100%": {
				transform: "rotate(360deg)"
			}
		});


		return style({
			$debugName: "todo-list",
			position: "relative", // Offset Parent for is-busy

			$nest: {

				"&::after": {
					content: "''",
					position: "absolute",
					top: 0,
					left: 0,
					bottom: "100%",
					right: "100%",
					backgroundColor: theme.lightColor,
					opacity: 0,
					pointerEvents: "none",
					transitionProperty: "opacity",
					transitionDelay: "500ms",
					transitionDuration: "300ms"
				},

				"html.is-busy &::after": {
					bottom: 0,
					right: 0,
					pointerEvents: "auto",
					transitionDelay: "0",
					opacity: 0.3,
				},

				"& .todo-list__item": {
					color: theme.darkTextColor,
					fontFamily: theme.fontFamily,
					fontSize: theme.fontSize,
					cursor: "pointer",
					$nest: {
						"&:hover": {
							color: theme.primaryColor
						}
					}
				},
				"& .todo-list__button": {
					...button(theme),
					margin: "0.1em",
					minWidth: "7em",
				},
				"& .todo-list__name": {
					display: "inline-block",
					minWidth: "10em",
					padding: namePadding
				},

				"& .todo-list__adding": {
					$nest: {
						"& .todo-list__checkbox": {
							display: "none",
						},
						"& .todo-list__input": {
							display: "none",
							fontFamily: theme.fontFamily,
							fontSize: theme.fontSize,
							border: `1px solid ${theme.primaryColor}`,
							padding: namePadding,
							marginRight: 5,
							marginLeft: -1, // border width
							borderRadius: 3
						},
						"& .todo-list__add-ok": {
							...button(theme),
							display: "none",
							margin: "0 0.1em",
							minWidth: "2em",
						},
						"& .todo-list__add-cancel": {
							...button(theme),
							display: "none",
							margin: "0 0.1em",
							minWidth: "2em",
						}
					}
				},

				// Adding state
				"&.todo-list--adding": {
					$nest: {
						"& .todo-list__adding .todo-list__checkbox": {
							display: "inline-block"
						},
						"& .todo-list__adding .todo-list__input": {
							display: "inline-block"
						},
						"html:not(.is-busy) & .todo-list__add-ok": {
							display: "inline-block"
						},

						"html:not(.is-busy) & .todo-list__add-cancel": {
							display: "inline-block"
						},
						".is-busy & .todo-list__adding::after": {
							content: "'◑'",
							display: "inline-block",
							fontSize: "1.3em",
							width: "1.3em",
							height: "1.3em",
							lineHeight: "1.3em",
							animation: `${spinAnimationName} 1s infinite linear`,
							transformOrigin: "50% 50%",
							textAlign: "center",
							color: theme.primaryColor
						}

					}
				},

			}
		});
	}

}