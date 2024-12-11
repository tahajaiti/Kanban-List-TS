import { display } from "./clickHandler.js";
import { msg } from "./msgPop.js";
import { createForm, removeForm } from "./createForm.js";
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
let tasks = JSON.parse(localStorage.getItem("tasks"));
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
removeBtn.addEventListener('click', () => {
    if (addCounter === 1) {
        msg("Cant go under one form", formContainer);
        return;
    }
    const formDelete = document.getElementById(`add${addCounter}`);
    removeForm(formDelete);
    addCounter--;
});
