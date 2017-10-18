import { html, render } from "lit-html/lib/lit-extended";
import { cssRule } from "typestyle";
import { BalancedScope } from "./BalancedScope";
import { blockInputEvents } from "./BlockInputEvents";
import { comp } from "./components/BaseComponent";
import { Header } from "./components/header";
import { TodoList } from "./components/TodoList";
import { TodoListCallbacks } from "./components/TodoListBase";
import { ITodoItem } from "./models/ITodoItem";
import { ITodoList } from "./models/ITodoList";
import { waitAsync } from "./utils";

export module app {

	cssRule("body", {
		margin: 0
	});

	const todoList = {
		items: [
			{ name: "Auto wassen", isCompleted: false },
			{ name: "Gras afrijden", isCompleted: false }
		]
	};


	// Simulate async mutations
	const mutations = {
		complete: async (todoItem: ITodoItem) => {
			todoItem.isCompleted = true;
			return waitAsync(1000);
		},
		remove: async (todoList: ITodoList, todoItem: ITodoItem) => {
			todoList.items = todoList.items.filter(i => i !== todoItem);
			return waitAsync(1000);
		},
		add: async (todoList: ITodoList, todoItem: ITodoItem) => {
			todoList.items = [...todoList.items, todoItem];
			return waitAsync(1000);
		},
	};

	const busyTracker = new BalancedScope({
		onStart: () => {
			document.documentElement.classList.add("is-busy");
			return blockInputEvents();
		},
		onEnd: unsubscribe => {
			unsubscribe();
			document.documentElement.classList.remove("is-busy");
		}
	});

	const callbacks: TodoListCallbacks = {
		onCompleteClick: async (todoItem) => {
			await busyTracker.during(mutations.complete(todoItem));
			todoListComp.invalidate();
		},
		onRemoveClick: async (todoList, todoItem) => {
			await busyTracker.during(mutations.remove(todoList, todoItem));
			todoListComp.invalidate();
		},
		onAddClick: async (todoList, todoItem) => {
			await busyTracker.during(mutations.add(todoList, todoItem));
			todoListComp.invalidate();
		},
	};

	const name = "JoVdB";
	const appEl = document.getElementById("app")!;
	const todoListComp = new TodoList(todoList, callbacks);

	render (html`<div>
		${comp(new Header(html`Hello ${name}`))}
		${comp(todoListComp)}
	</div>`, appEl);
}