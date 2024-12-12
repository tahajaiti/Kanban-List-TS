import { display } from "./clickHandler.js";
import { msg } from "./msgPop.js";
import { createForm, removeForm } from "./createForm.js";
import { createTasks } from "./createTasks.js";
const addBtn = document.querySelector("#addBtn");
const addDisplay = document.querySelector("#addDisplay");
const closeBtnAdd = document.querySelector("#closeBtnAdd");
const formContainer = document.querySelector("#formsContainer");
const applyBtn = document.querySelector("#applyBtn");
const displayContainer = document.querySelector("#displayTask");
const closeDisplayBtn = document.querySelector("#closeDisplayBtn");
const deleteBtn = document.querySelector("#deleteBtn");
const multiBtn = document.querySelector("#addForm");
const removeBtn = document.querySelector("#removeForm");
const searchInput = document.querySelector("#searchInput");
const editForm = document.querySelector("#editDisplay");
let displayedTaskId = null;
let addCounter = 1;
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
//ADD DISPLAY
display(addDisplay, addBtn, closeBtnAdd);
//MULTIPLE BUTTON
multiBtn.addEventListener("click", () => {
    if (addCounter >= 5) {
        msg("Max Forms", formContainer);
        return;
    }
    addCounter++;
    createForm(addCounter, formContainer);
});
//REMOVE FORM
removeBtn.addEventListener("click", () => {
    if (addCounter === 1) {
        msg("Cant go under one form", formContainer);
        return;
    }
    const formDelete = document.getElementById(`add${addCounter}`);
    removeForm(formDelete);
    addCounter--;
});
const genId = () => {
    return Date.now() - Math.floor(Math.random() * 1000);
};
applyBtn.addEventListener("click", () => {
    const addModals = document.querySelectorAll(".formReal");
    addModals.forEach((form) => {
        const inputs = {
            title: form.querySelector("#nameInput"),
            desc: form.querySelector("#dcrpInput"),
            date: form.querySelector("#dateInput"),
            status: form.querySelector("#statusInput"),
            priority: form.querySelector("#prioInput"),
        };
        if (Object.values(inputs).some((input) => !input)) {
            console.error("Invalid inputs");
            msg("Invalid inputs", form);
            return;
        }
        const { title, desc, date, status, priority } = inputs;
        const isTitleValid = /^[a-zA-Z\s]*$/.test(title.value.trim());
        const isDateValid = !!Date.parse(date.value.trim());
        if (!isTitleValid || !isDateValid) {
            msg("Please enter valid input", form);
            return;
        }
        const newTask = {
            id: genId(),
            title: title.value.trim(),
            description: desc.value.trim(),
            date: date.value.trim(),
            status: status.value.toLowerCase(),
            priority: priority.value,
        };
        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        Object.values(inputs).forEach((input) => {
            if (input)
                input.value = "";
        });
    });
    createTasks(tasks);
});
