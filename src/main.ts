import { display } from "./clickHandler.js";
import { msg } from "./msgPop.js";
import { createForm, removeForm } from "./createForm.js";

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
const applyBtn = document.querySelector<HTMLButtonElement>("#applyBtn");
const displayContainer = document.querySelector<HTMLDivElement>("#displayTask");
const closeDisplayBtn =
	document.querySelector<HTMLButtonElement>("#closeDisplayBtn");
const deleteBtn = document.querySelector<HTMLButtonElement>("#deleteBtn");
const multiBtn = document.querySelector<HTMLButtonElement>(
	"#addForm",
) as HTMLButtonElement;
const removeBtn = document.querySelector<HTMLButtonElement>("#removeForm") as HTMLButtonElement;
const searchInput = document.querySelector<HTMLInputElement>("#searchInput");
const editForm = document.querySelector<HTMLButtonElement>("#editDisplay");

let displayedTaskId: number | null = null;
let addCounter: number = 1;

type task = {
	id: number;
	title: string;
	description: string;
	date: string;
	status: string;
	priority: string;
};

let tasks: task[] = JSON.parse(localStorage.getItem("tasks")!);

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
removeBtn.addEventListener('click', () => {
    if (addCounter === 1){
        msg<HTMLDivElement>("Cant go under one form", formContainer);
        return;
    }

    const formDelete = document.getElementById(`add${addCounter}`) as HTMLDivElement;
    removeForm<HTMLDivElement>(formDelete);

    addCounter--;
});
