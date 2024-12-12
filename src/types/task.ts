export enum Status {
    Todo = "todo",
    Doing = "doing",
    Done = "done",
}

export enum Priority {
    P1 = "P1",
    P2 = "P2",
    P3 = "P3",
}

export type task = {
	id: number;
	title: string;
	description: string;
	date: string;
	status: Status;
	priority: Priority;
};