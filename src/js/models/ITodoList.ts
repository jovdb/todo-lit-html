import { ITodoItem } from "./ITodoItem";

export interface ITodoList {
	items: ReadonlyArray<ITodoItem>;
}