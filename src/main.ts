import { task, Status, Priority } from "./types/task.js";

import { display } from "./clickHandler.js";
import { msg } from "./msgPop.js";
import { createForm, removeForm } from "./createForm.js";
import { createTasks } from "./createTasks.js";

const addBtn = document.querySelector<HTMLButtonElement>(
	"#addBtn",
) as HTMLButtonElement;

const addDisplay = document.querySelector<HTMLDivElement>(
	"#addDisplay",
) as HTMLDivElement;

const closeBtnAdd = document.querySelector<HTMLButtonElement>(
	"#closeBtnAdd",
) as HTMLButtonElement;

const formContainer = document.querySelector(
	"#formsContainer",
) as HTMLDivElement;

const applyBtn = document.querySelector<HTMLButtonElement>(
	"#applyBtn",
) as HTMLButtonElement;

const displayContainer = document.querySelector<HTMLDivElement>("#displayTask");

const closeDisplayBtn =
	document.querySelector<HTMLButtonElement>("#closeDisplayBtn");

const deleteBtn = document.querySelector<HTMLButtonElement>("#deleteBtn");

const multiBtn = document.querySelector<HTMLButtonElement>(
	"#addForm",
) as HTMLButtonElement;

const removeBtn = document.querySelector<HTMLButtonElement>(
	"#removeForm",
) as HTMLButtonElement;

const searchInput = document.querySelector<HTMLInputElement>("#searchInput");

const editForm = document.querySelector<HTMLButtonElement>("#editDisplay");

let displayedTaskId: number | null = null;
let addCounter: number = 1;

let tasks: task[] = JSON.parse(localStorage.getItem("tasks")!) || [];

//ADD DISPLAY
display<HTMLDivElement, HTMLButtonElement>(addDisplay, addBtn, closeBtnAdd);

//MULTIPLE BUTTON
multiBtn.addEventListener("click", () => {
	if (addCounter >= 5) {
		msg<HTMLDivElement>("Max Forms", formContainer);
		return;
	}
	addCounter++;
	createForm(addCounter, formContainer);
});

//REMOVE FORM
removeBtn.addEventListener("click", () => {
	if (addCounter === 1) {
		msg<HTMLDivElement>("Cant go under one form", formContainer);
		return;
	}

	const formDelete = document.getElementById(
		`add${addCounter}`,
	) as HTMLDivElement;
	removeForm<HTMLDivElement>(formDelete);

	addCounter--;
});

const genId = () => {
	return Date.now() - Math.floor(Math.random() * 1000);
};

applyBtn.addEventListener("click", () => {
	const addModals = document.querySelectorAll<HTMLElement>(".formReal");

	addModals.forEach((form) => {
		const inputs = {
			title: form.querySelector<HTMLInputElement>("#nameInput"),
			desc: form.querySelector<HTMLInputElement>("#dcrpInput"),
			date: form.querySelector<HTMLInputElement>("#dateInput"),
			status: form.querySelector<HTMLSelectElement>("#statusInput"),
			priority: form.querySelector<HTMLSelectElement>("#prioInput"),
		};

		if (Object.values(inputs).some((input) => !input)) {
			console.error("Invalid inputs");
            msg<HTMLElement>("Invalid inputs", form);
			return;
		}

		const { title, desc, date, status, priority } = inputs;

		const isTitleValid = /^[a-zA-Z\s]*$/.test(title!.value.trim());
		const isDateValid = !!Date.parse(date!.value.trim());

		if (!isTitleValid || !isDateValid) {
			msg<HTMLElement>("Please enter valid input", form);
			return;
		}

		const newTask: task = {
			id: genId(),
			title: title!.value.trim(),
			description: desc!.value.trim(),
			date: date!.value.trim(),
			status: status!.value.toLowerCase() as Status,
			priority: priority!.value as Priority,
		};

		tasks.push(newTask);

		localStorage.setItem("tasks", JSON.stringify(tasks));

		Object.values(inputs).forEach((input) => {
			if (input) input.value = "";
		});
	});

    createTasks(tasks);
});

