import { display } from "./clickHandler.ts";

const addBtn = document.querySelector<HTMLButtonElement>("#addBtn") as HTMLButtonElement;
const addDisplay = document.querySelector<HTMLDivElement>("#addDisplay") as HTMLDivElement;
const closeBtnAdd = document.querySelector<HTMLButtonElement>("#closeBtnAdd") as HTMLButtonElement;
const applyBtn = document.querySelector<HTMLButtonElement>("#applyBtn");
const displayContainer = document.querySelector<HTMLDivElement>("#displayTask");
const closeDisplayBtn = document.querySelector<HTMLButtonElement>("#closeDisplayBtn");
const deleteBtn = document.querySelector<HTMLButtonElement>("#deleteBtn");
const multiBtn = document.querySelector<HTMLButtonElement>("#addForm");
const removeBtn = document.querySelector<HTMLButtonElement>("#removeForm");
const searchInput = document.querySelector<HTMLInputElement>("#searchInput");
const editForm = document.querySelector<HTMLButtonElement>("#editDisplay");

let displayedTaskId: number | null = null;
let addCounter: number = 1;

type task = {
    id: number,
    title: string,
    description: string,
    date: string,
    status: string,
    priority: string
}

let tasks: task[] = JSON.parse(localStorage.getItem("tasks")!);

display<HTMLDivElement, HTMLButtonElement>(addDisplay, addBtn, closeBtnAdd);

