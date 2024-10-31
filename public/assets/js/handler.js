const addBtn = document.querySelector("#addBtn");
const addDisplay = document.querySelector("#addDisplay");
const closeBtnAdd = document.querySelector("#closeBtnAdd");
const applyBtn = document.querySelector("#applyBtn");
const displayContainer = document.querySelector("#displayTask");
const closeDisplayBtn = document.querySelector("#closeDisplayBtn");
const deleteBtn = document.querySelector("#deleteBtn");
const multiBtn = document.querySelector("#addForm");
const removeBtn = document.querySelector("#removeForm");

let displayedTaskId = null;
let addCounter = 1;

// loading tasks from localstorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// input array
const formInputs = {
	title: document.querySelector("input[name='title']"),
	description: document.querySelector("input[name='dcrp']"),
	date: document.querySelector("input[name='date']"),
	status: document.querySelector("select[name='status']"),
	priority: document.querySelector("select[name='priority']"),
};

// close and open add display
addBtn.addEventListener("click", () => {
	addDisplay.classList.add("flex");
	addDisplay.classList.remove("hidden");
	addDisplay.classList.add("animate-[fadeIn_0.25s_ease-in-out_forwards]");
});

closeBtnAdd.addEventListener("click", () => {
	addDisplay.classList.remove("animate-[fadeIn_0.25s_ease-in-out-forwards]");
	addDisplay.classList.remove("flex");
	addDisplay.classList.add("hidden");
});

//mutliple add form
multiBtn.addEventListener("click", () => {
	if (addCounter >= 5) {
		alert("Max forms");
		return;
	} else {
		addCounter++;
		const formContainer = document.querySelector("#formContainer");
		const newForm = document.createElement("div");
		newForm.className = `addForm`;
		newForm.id = `add${addCounter}`;
		newForm.innerHTML = `
		<div>
            <label for="title" class="text-2xl text-greytwo">Title</label>
            <input type="text" name="title" class="input-s">
          </div>
          <div>
            <label for="dcrp" class="text-2xl text-greytwo">Description</label>
            <input type="text" name="dcrp" class="input-s max-w-xl">
          </div>
          <div>
            <label for="date" class="text-2xl text-greytwo">Date</label>
            <input type="date" name="date" class="input-s" min="2020-01-01">
          </div>
          <div>
            <label for="status" class="text-2xl text-greytwo">Status</label>
            <select name="status" id="" class="input-s">
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label for="priority" class="text-2xl text-greytwo">Priority</label>
            <select name="priority" id="" class="input-s">
              <option value="P3">P3</option>
              <option value="P2">P2</option>
              <option value="P1">P1</option>
            </select>
          </div>`;

		formContainer.appendChild(newForm);
	}
});

//remove one multiple add form
removeBtn.addEventListener("click", ()=>{
	if (addCounter === 1){
		alert("Cant go under one form");
		return;
	} else {
		const formDelete = document.getElementById(`add${addCounter}`);
		console.log(formDelete);
		formDelete.remove();
		addCounter--;
	}
});

//generate unique id
const genId = () => {
	return `${Date.now() - Math.floor(Math.random() * 1000)}`;
};

// generate tasks
const createTasks = () => {
	const swimLanes = {
		todo: document.querySelectorAll(".swim-lane")[0],
		doing: document.querySelectorAll(".swim-lane")[1],
		done: document.querySelectorAll(".swim-lane")[2],
	};

	// clear content before any appending
	Object.values(swimLanes).forEach((lane) => (lane.innerHTML = ""));

	// creating the actual task
	tasks.forEach((task) => {
		const newTask = document.createElement("div");
		newTask.className = `task card`;
		newTask.draggable = true;
		newTask.dataset.id = task.id;
		newTask.dataset.description = task.description;
		newTask.dataset.priority = task.priority;

		let bgColor, hoverColor, activeColor, pColor;
		if (task.priority === "P1") {
			bgColor = "bg-cardred";
			hoverColor = "hover:bg-cardredhov";
			activeColor = "active:bg-cardredactive";
			pColor = "red-500";
		} else if (task.priority === "P2") {
			bgColor = "bg-cardorange";
			hoverColor = "hover:bg-cardorangehov";
			activeColor = "active:bg-cardorangeactive";
			pColor = "orange-400";
		} else {
			bgColor = "bg-cardgreen";
			hoverColor = "hover:bg-cardgreenhov";
			activeColor = "active:bg-cardgreenactive";
			pColor = "green-500";
		}

		newTask.classList.add(bgColor, hoverColor, activeColor);

		newTask.innerHTML = `
            <div class="flex justify-between items-center mb-4 p-2">
                <span class="icon-[mage--edit] text-3xl text-greytwo cursor-pointer hover:bg-blue-500 transition-all"></span>
                <p class="text-2xl text-greytwo font-mlight">${task.title}</p>
                <span class="icon-[mage--trash] text-3xl text-greytwo hover:bg-red-500 transition-all" id="deleteBtn"></span>
            </div>
            <div class="flex justify-between content-baseline">
                <div class="bg-blue-200 left-tag">${task.date}</div>
                <div class="right-tag bg-${pColor}">${task.priority} </div>
            </div>`;

		// appending the correct status
		const taskLane = swimLanes[task.status];
		if (taskLane) {
			taskLane.appendChild(newTask);
		} else {
			console.error("error");
		}

		// add drag class
		addDragEventListeners(newTask);
		//add display on click
		addDisplayEvenetListeners(newTask);
		//calling the function
		newTask.querySelector("#deleteBtn").addEventListener("click", (e) => {
			e.stopPropagation();
			deleteTask(task.id);
		});
	});

	sortTask();
	updateStats();
};

//always inserting in the top
const insertTop = (container) => {
	const tasks = container.querySelectorAll(".task:not(.is-dragging)");
	return tasks.length > 0 ? tasks[0] : null;
};

// adding the drag
const addDragEventListeners = (task) => {
	task.addEventListener("dragstart", () => {
		task.classList.add("is-dragging");
	});
	task.addEventListener("dragend", () => {
		task.classList.remove("is-dragging");
	});
};

//drag function
document.querySelectorAll(".swim-lane").forEach((container) => {
	container.addEventListener("dragover", (e) => {
		e.preventDefault();

		const topTask = insertTop(container);
		const currentTask = document.querySelector(".is-dragging");

		if (!topTask) {
			container.appendChild(currentTask);
		} else {
			container.insertBefore(currentTask, topTask);
		}
	});

	container.addEventListener("drop", (e) => {
		e.preventDefault();
		const currentTask = document.querySelector(".is-dragging");

		if (currentTask) {
			const newStatus = container.getAttribute("status");

			updateTaskStatus(currentTask, newStatus);
		}
	});
});

// apply button for adding a task
applyBtn.addEventListener("click", () => {
	const title = formInputs.title.value.trim();
	const description = formInputs.description.value.trim();
	const date = formInputs.date.value.trim();
	const statusValue = formInputs.status.value.trim();
	const priority = formInputs.priority.value.trim();

	let checkTitle = /^[a-zA-Z\s]*$/gm.test(title);

	console.log(checkTitle);

	if (!checkTitle || !date) {
		alert("Please enter the a valid input.");
		return; // return if its invalid stops it from further executing
	}

	const newTask = {
		id: genId(),
		title,
		description,
		date,
		status: statusValue.toLowerCase(),
		priority,
	};

	tasks.push(newTask);

	// save to localstorage
	localStorage.setItem("tasks", JSON.stringify(tasks));

	//sort
	sortTask();

	// create
	createTasks();

	//update
	updateStats();

	// clearinput
	formInputs.title.value = "";
	formInputs.description.value = "";
	formInputs.date.value = "";
	formInputs.status.value = "todo";
	formInputs.priority.value = "P3";

	// close display
	addDisplay.classList.add("hidden");
	addDisplay.classList.remove("flex");
});

//update status
const updateTaskStatus = (taskObj, newStatus) => {
	const taskId = taskObj.dataset.id;

	const taskUpdate = tasks.find((task) => task.id === taskId);
	if (taskUpdate) {
		//updating status
		taskUpdate.status = newStatus.toLowerCase();

		//saving
		localStorage.setItem("tasks", JSON.stringify(tasks));

		//update
		updateStats();
		createTasks();
	}
};

//update statistic
const updateStats = () => {
	const swimLanes = {
		todo: document.querySelectorAll(".swim-lane")[0],
		doing: document.querySelectorAll(".swim-lane")[1],
		done: document.querySelectorAll(".swim-lane")[2],
	};

	const counts = {
		todo: swimLanes.todo.querySelectorAll(".task").length,
		doing: swimLanes.doing.querySelectorAll(".task").length,
		done: swimLanes.done.querySelectorAll(".task").length,
	};

	document.querySelector("#todostat").textContent = counts.todo;
	document.querySelector("#doingstat").textContent = counts.doing;
	document.querySelector("#donestat").textContent = counts.done;
};

//display data
const addDisplayEvenetListeners = (task) => {
	task.addEventListener("click", () => {
		const taskTitle = task.querySelector("p").textContent;
		const taskDate = task.querySelector(".left-tag").textContent;
		const taskPriority = task.querySelector(".right-tag").textContent;
		const taskDescription = task.dataset.description || "No description.";

		displayedTaskId = task.dataset.id;

		let pColor;
		if (task.dataset.priority === "P1") {
			pColor = "bg-red-500";
		} else if (task.dataset.priority === "P2") {
			pColor = "bg-orange-400";
		} else {
			pColor = "bg-green-500";
		}

		displayContainer.querySelector("#titleContainer").textContent = taskTitle;
		displayContainer.querySelector("#descContainer").textContent =
			taskDescription;
		displayContainer.querySelector(".left-tag").textContent = taskDate;
		const rightTag = displayContainer.querySelector(".right-tag");
		rightTag.textContent = taskPriority;
		rightTag.className = `right-tag ${pColor}`;

		displayContainer.classList.add("animate-[fadeIn_0.25s_ease-in-out_forwards]");
		displayContainer.classList.remove("hidden");
		displayContainer.classList.add("flex");
	});
	closeDisplayBtn.addEventListener("click", () => {
		displayContainer.classList.remove(
			"animate-[fadeIn_0.25s_ease-in-out_forwards]",
		);
		displayContainer.classList.add("hidden");
		displayContainer.classList.remove("flex");

		displayContainer.querySelector("#titleContainer").textContent = "";
		displayContainer.querySelector("#descContainer").textContent = "";
		displayContainer.querySelector(".left-tag").textContent = "";
		const rightTag = displayContainer.querySelector(".right-tag");
		rightTag.textContent = "";
		rightTag.className = "right-tag";

		displayedTaskId = null;
	});

	deleteBtn.addEventListener("click", () => {
		if (displayedTaskId) {
			deleteTask(displayedTaskId);
			displayedTaskId = null;
			displayContainer.classList.add("hidden");
		}
	});
};

//delete task
const deleteTask = (taskId) => {
	const taskIndex = tasks.findIndex((task) => task.id === taskId);

	if (taskIndex > -1) {
		tasks.splice(taskIndex, 1);
	}

	// updating the local storage
	localStorage.setItem("tasks", JSON.stringify(tasks));

	// generating the tasks to accomodate the delete
	createTasks();
};

//sort
const sortTask = () => {
	const prio = { P1: 1, P2: 2, P3: 3 }; //order of priority P1 being the highest

	if (tasks.length < 2) {
		return;
	} else {
		for (let i = 0; i < tasks.length - 1; i++) {
			for (let j = 0; j < tasks.length - i - 1; j++) {
				const taskA = tasks[j];
				const taskB = tasks[j + 1];

				if (prio[taskA.priority] > prio[taskB.priority]) {
					[tasks[j], tasks[j + 1]] = [tasks[j + 1], tasks[j]];
				} else if (prio[taskA.priority] === prio[taskB.priority]) {
					const dateA = new Date(taskA.date);
					const dateB = new Date(taskB.date);

					if (dateA > dateB) {
						[tasks[j], tasks[j + 1]] = [tasks[j + 1], tasks[j]];
					}
				}
			}
		}
		console.log("sorted");
	}

	localStorage.setItem("tasks", JSON.stringify(tasks));
};

// loading the tasks when the html file is fully loaded
document.addEventListener("DOMContentLoaded", createTasks);
