const addBtn = document.querySelector("#addBtn");
const addDisplay = document.querySelector("#addDisplay");
const closeBtnAdd = document.querySelector("#closeBtnAdd");
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

// loading tasks from localstorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// close and open add display
addBtn.addEventListener("click", () => {
	anime({
		targets: '#addDisplay',
		opacity: [0, 1],
		duration: 250,
		easing: 'linear',
		begin: () => {
			document.querySelector('#addDisplay').style.display = 'flex';
		},
	});

	anime({
		targets: '#mainAdd',
		translateX: [100, 0],
		opacity: [0, 1],
		duration: 1000,
		easing: 'easeOut',
	});
});

closeBtnAdd.addEventListener("click", () => {
	anime({
		targets: '#mainAdd',
		translateX: -200,
		opacity: 0,
		duration: 700,
		easing: 'linear',
	});

	anime({
		targets: '#addDisplay',
		opacity: 0,
		duration: 250,
		easing: 'linear',
		complete: () => {
			document.querySelector('#addDisplay').style.display = 'none';
		},
	});

});

//mutliple add form
multiBtn.addEventListener("click", () => {
	if (addCounter >= 5) {
		alert("Max forms");
		return;
	} else {
		const formContainer = document.querySelector("#formsContainer");
		addCounter++;
		const newForm = document.createElement("div");
		newForm.className = `addForm formReal`;
		newForm.id = `add${addCounter}`;
		newForm.innerHTML = `
		<div>
              <label for="title" class="text-2xl text-greytwo">Title</label>
              <input type="text" name="title" class="input-s formInput" id="nameInput">
            </div>
            <div>
              <label for="dcrp" class="text-2xl text-greytwo">Description</label>
              <input type="text" name="dcrp" class="input-s max-w-xl formInput" id="dcrpInput">
            </div>
            <div>
              <label for="date" class="text-2xl text-greytwo">Date</label>
              <input type="date" name="date" class="input-s formInput" min="2020-01-01" id="dateInput">
            </div>
            <div>
              <label for="status" class="text-2xl text-greytwo">Status</label>
              <select name="status" class="input-s formInput" id="statusInput">
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label for="priority" class="text-2xl text-greytwo">Priority</label>
              <select name="priority" class="input-s formInput" id="prioInput">
                <option value="P3">P3</option>
                <option value="P2">P2</option>
                <option value="P1">P1</option>
              </select>
            </div>`;
		anime.set(newForm, {
			translateY: -50,
			opacity: 0,
		});
		formContainer.appendChild(newForm);
		anime({
			targets: newForm,
			translateY: 0,
			opacity: 1,
			duration: 250,
			easing: 'linear',
		});

	}
});

//remove one multiple add form
removeBtn.addEventListener("click", () => {
	if (addCounter === 1) {
		alert("Cant go under one form");
		return;
	} else {
		const formDelete = document.getElementById(`add${addCounter}`);
		anime({
			targets: formDelete,
			translateY: -50,
			opacity: 0,
			duration: 250,
			easing: 'linear',
			complete: () => {
				formDelete.remove();
			},
		});


		addCounter--;
	}
});

//generate unique id
const genId = () => {
	return `${Date.now() - Math.floor(Math.random() * 1000)}`;
};

// generate tasks
const createTasks = (disaplyedTasks) => {
	const swimLanes = {
		todo: document.querySelectorAll(".swim-lane")[0],
		doing: document.querySelectorAll(".swim-lane")[1],
		done: document.querySelectorAll(".swim-lane")[2],
	};

	// clear content before any appending
	Object.values(swimLanes).forEach((lane) => (lane.innerHTML = ""));

	// creating the actual task
	disaplyedTasks.forEach((task) => {
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
                <span id="editBtn" class="icon-[mage--edit] text-3xl text-greytwo cursor-pointer hover:bg-blue-500 transition-all"></span>
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
		addDisplayEventListeners(newTask);
		//calling the function
		newTask.querySelector("#deleteBtn").addEventListener("click", (e) => {
			e.stopPropagation();
			deleteTask(task.id);
		});
		newTask.querySelector("#editBtn").addEventListener("click", (e) => {
			e.stopPropagation();
			editTask(task.id);
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
	const formContainer = document.querySelectorAll(".formReal");

	formContainer.forEach((form) => {
		const inputs = {
			title: form.querySelector("#nameInput").value,
			description: form.querySelector("#dcrpInput").value,
			date: form.querySelector("#dateInput").value,
			status: form.querySelector("#statusInput").value,
			priority: form.querySelector("#prioInput").value
		}

		let checkTitle = /^[a-zA-Z\s]*$/gm.test(inputs.title);

		if (!checkTitle || !inputs.date) {
			alert("Please enter the a valid input.");
			return; // return if its invalid stops it from further executing
		}

		const newTask = {
			id: genId(),
			title: inputs.title.trim(),
			description: inputs.description.trim(),
			date: inputs.date.trim(),
			status: inputs.status.toLowerCase(),
			priority: inputs.priority,
		};

		tasks.push(newTask);

		// save to localstorage
		localStorage.setItem("tasks", JSON.stringify(tasks));

		inputs.title = "";
		inputs.description = "";
		inputs.date = "";
		inputs.statusValue = "";
		inputs.priority = "";

		if (form.id !== "add1") {
			form.remove();
			addCounter--;
			console.log(addCounter);
		}
	});

	//sort
	sortTask();

	// create
	createTasks(tasks);

	//update
	updateStats();

	// close display
	anime({
		targets: '#addDisplay',
		translateX: -200,
		opacity: 0,
		duration: 250,
		easing: 'linear',
		complete: () => {
			const addDisplay = document.querySelector('#addDisplay');
			addDisplay.style.display = 'none';
			addDisplay.style.transform = 'translateX(0)';
		},
	});

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
		createTasks(tasks);
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

//prio colors
const getPriorityColor = (priority) => {
	switch (priority) {
		case "P1":
			return "bg-red-500";
		case "P2":
			return "bg-orange-400";
		default:
			return "bg-green-500";
	}
};

//display task
const addDisplayEventListeners = (task) => {
	const titleContainer = displayContainer.querySelector("#titleContainer");
	const descContainer = displayContainer.querySelector("#descContainer");
	const dateTag = displayContainer.querySelector(".left-tag");
	const priorityTag = displayContainer.querySelector(".right-tag");

	const openDisplay = () => {
		const taskTitle = task.querySelector("p").textContent;
		const taskDate = task.querySelector(".left-tag").textContent;
		const taskPriority = task.querySelector(".right-tag").textContent;
		const taskDescription = task.dataset.description || "No description.";
		const pColor = getPriorityColor(task.dataset.priority);

		// Update displayed task details
		displayedTaskId = task.dataset.id;
		titleContainer.textContent = taskTitle;
		descContainer.textContent = taskDescription;
		dateTag.textContent = taskDate;
		priorityTag.textContent = taskPriority;
		priorityTag.className = `right-tag ${pColor}`;

		// Show the display container
		displayContainer.classList.remove("hidden");
		displayContainer.classList.add(
			"flex",
			"animate-[fadeIn_0.25s_ease-in-out_forwards]"
		);
	};

	const closeDisplay = () => {
		// Hide the display container
		displayContainer.classList.add("hidden");
		displayContainer.classList.remove(
			"flex",
			"animate-[fadeIn_0.25s_ease-in-out_forwards]"
		);

		// Clear displayed task details
		titleContainer.textContent = "";
		descContainer.textContent = "";
		dateTag.textContent = "";
		priorityTag.textContent = "";
		priorityTag.className = "right-tag";

		displayedTaskId = null;
	};

	const deleteTaskAndClose = () => {
		if (displayedTaskId) {
			deleteTask(displayedTaskId);
			closeDisplay();
		}
	};

	// Event listeners
	task.addEventListener("click", openDisplay);
	closeDisplayBtn.addEventListener("click", closeDisplay);
	deleteBtn.addEventListener("click", deleteTaskAndClose);
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
	createTasks(tasks);
};

const editInputs = {
	title: editForm.querySelector('#nameEdit'),
	description: editForm.querySelector('#dEdit'),
	date: editForm.querySelector('#dateEdit'),
	status: editForm.querySelector('#statusEdit'),
	priority: editForm.querySelector('#prioEdit'),
};


const editTask = (taskId) => {
	const taskIndex = tasks.findIndex((task) => task.id === taskId);
	const selectedTask = tasks[taskIndex];

	editForm.classList.remove('hidden');
	editForm.classList.add('flex');

	Object.keys(editInputs).forEach((input) => {
		editInputs[input].value = selectedTask[input];
	});

	const applyEdit = document.querySelector('#applyEdit');

	applyEdit.addEventListener('click', (e) => {
		e.stopPropagation();
		Object.keys(editInputs).forEach((input) => {
			selectedTask[input] = editInputs[input].value;
		});

		tasks[taskIndex] = selectedTask;

		localStorage.setItem('tasks', JSON.stringify(tasks));
		createTasks(tasks);
		editForm.classList.remove('flex');
		editForm.classList.add('hidden');
	});
};

document.querySelector('#closeBtnEdit').addEventListener('click', (e) => {
	e.stopPropagation();
	editForm.classList.remove('flex');
	editForm.classList.add('hidden');
});

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

//search function
searchInput.addEventListener("keyup", (e) => {
	let tasksData = JSON.parse(localStorage.getItem("tasks")) || [];

	const searchData = e.target.value.toLowerCase();

	const fileterdData = tasksData.filter((o) =>
		o.title.toLowerCase().includes(searchData),
	);

	createTasks(fileterdData);
});

const loadDarkMode = () => {
	const theme = localStorage.getItem('theme');
	if (theme === 'dark') {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
};

document.getElementById('toggleDark').addEventListener('click', () => {
	const theme = localStorage.getItem('theme');

	if (theme === 'dark') {
		document.documentElement.classList.remove('dark');
		localStorage.setItem('theme', 'white');
	} else {
		document.documentElement.classList.add('dark');
		localStorage.setItem('theme', 'dark');
	}
});

loadDarkMode();

// loading the tasks when the html file is fully loaded
document.addEventListener("DOMContentLoaded", createTasks(tasks));
