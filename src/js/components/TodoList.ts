import { html } from "lit-html/lib/lit-extended";
import { ITodoItem } from "../models/ITodoItem";
import { ITodoList } from "../models/ITodoList";
import { TodoListBase, TodoListCallbacks } from "./TodoListBase";

export class TodoList extends TodoListBase {

	private readonly data: ITodoList;
	private isAddMode: boolean;

	constructor(data: ITodoList, callbacks: TodoListCallbacks) {
		super(callbacks);
		this.data = data;
		this.isAddMode = false;
	}
	public startAddMode() {
		this.isAddMode = true;
		this.update();

		// Focus element
		const inputEl = this.getRootChildren()[0].querySelector<HTMLInputElement>(".todo-list__input");
		if (inputEl) inputEl.focus();
	}

	public endAddMode() {
		this.isAddMode = false;
		this.update();

		// Clear element
		const inputEl = this.getRootChildren()[0].querySelector<HTMLInputElement>(".todo-list__input");
		if (inputEl) inputEl.value = "";
	}

	private async addTodoItem(name: string) {

		if (name) {
			try {
				await this.callbacks.onAddClick(this.data, {
					name,
					isCompleted: false
				});
				this.endAddMode();
			} catch {
				// noop
			}
		} else {
			this.endAddMode();
		}
	}

	private onStartAddModeClick(e: MouseEvent) {
		this.startAddMode();
		e.stopPropagation();
	}

	private onAddListItemClick(e: MouseEvent) {

		const inputEl = this.getRootChildren()[0].querySelector<HTMLInputElement>(".todo-list__input");
		if (inputEl) this.addTodoItem(inputEl.value);

		const addButtonEl = this.getRootChildren()[0].querySelector<HTMLButtonElement>(".todo-list__adding .todo-list__button");
		if (addButtonEl) addButtonEl.focus();

		e.stopPropagation();
	}

	private onEndAddModeClick(e: MouseEvent) {
		this.endAddMode();
		e.stopPropagation();
	}

	private onRemoveClick(e: MouseEvent, item: ITodoItem) {
		this.callbacks.onRemoveClick(this.data, item);
		e.stopPropagation();
	}

	private onCompleteClick(e: MouseEvent, item: ITodoItem) {
		const el = e.currentTarget as HTMLInputElement;
		el.checked = !el.checked; // Don't change
		this.callbacks.onCompleteClick(item);
		e.stopPropagation();
	}

	private onKeyDown(e: MouseEvent) {
		if (e.which === 13 || e.which === 10) {
			this.addTodoItem((e.currentTarget as HTMLInputElement).value);
		}
		e.stopPropagation();
	}

	protected getTemplate() {

		return html`
		<div class$=${this.rootClassName + (this.isAddMode ? " todo-list--adding" : "")}>

			<!-- Todo list -->
			${this.data.items.map(todoItem => html`
				<div>
					<button class="todo-list__button" on-click="${(e: MouseEvent) => { this.onRemoveClick(e, todoItem); }}">✖ Remove</button>
					<label class="todo-list__item">
						<input class="todo-list__checkbox" type="checkbox" checked="${todoItem.isCompleted}" on- click="${(e: MouseEvent) => { this.onCompleteClick(e, todoItem); }}"/>
						<span class="todo-list__name">${todoItem.name}</span>
					</label>
				</div>`
			)}

			<!-- Adding -->
			<div class="todo-list__adding">
				<button class="todo-list__button" on-click="${this.onStartAddModeClick.bind(this)}" disabled="${this.isAddMode}">+ Add </button>
				<label class="todo-list__item">
					<input class="todo-list__checkbox" type="checkbox" disabled/>
					<input class="todo-list__input" on-keydown="${this.onKeyDown.bind(this)}"/>
				</label>
				<button class="todo-list__add-ok" on-click="${this.onAddListItemClick.bind(this)}">✓</button>
				<button class="todo-list__add-cancel" on-click="${this.onEndAddModeClick.bind(this)}">✖</button>
			</div>
		</div>`;
	}
}