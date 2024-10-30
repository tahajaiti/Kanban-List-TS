const addBtn = document.querySelector("#addBtn");
const addDisplay = document.querySelector("#addDisplay");
const closeBtnAdd = document.querySelector("#closeBtnAdd");
const applyBtn = document.querySelector("#applyBtn");
const displayContainer = document.querySelector("#displayTask");
const closeDisplayBtn = document.querySelector("#closeDisplayBtn");
const allTasks = document.querySelectorAll(".task");
const taskContainers = document.querySelectorAll(".swim-lane");

// input array
const formInputs = {
    title: document.querySelector("input[name='title']"),
    description: document.querySelector("input[name='dcrp']"),
    date: document.querySelector("input[name='date']"),
    status: document.querySelector("select[name='status']"),
    priority: document.querySelector("select[name='priority']")
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

//generate id
const genId = () => {
    return `${Date.now()-Math.floor(Math.random() * 1000)}`;
};

// generate tasks
const createTasks = () => {
    const swimLanes = {
        todo: document.querySelectorAll(".swim-lane")[0],
        doing: document.querySelectorAll(".swim-lane")[1],
        done: document.querySelectorAll(".swim-lane")[2]
    };

    // clear content before any appending
    // Object.values(swimLanes).forEach(lane => lane.innerHTML = "");

    // creating the actual task
    tasks.forEach((task) => {
        const newTask = document.createElement("div");
        newTask.className = `task card`;
        newTask.draggable = true;
        newTask.dataset.id = task.id;
        newTask.dataset.description = task.description;
        newTask.dataset.priority = task.priority;

        let bgColor, hoverColor, activeColor, pColor;
        if (task.priority === 'P1') {
            bgColor = "bg-cardred";
            hoverColor = "hover:bg-cardredhov";
            activeColor = "active:bg-cardredactive";
            pColor = "red-500";
        } else if (task.priority === 'P2') {
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
                <span class="icon-[mage--trash] text-3xl text-greytwo hover:bg-red-500 transition-all"></span>
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
    });

    updateStats();
};

//checking where to insert
const insertAbove = (container, mouseY) => {
    const tasks = container.querySelectorAll(".task:not(.is-dragging)");

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    tasks.forEach((task) => {
        const { top } = task.getBoundingClientRect();
        const offset = mouseY - top;

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestTask = task;
        }
    });

    return closestTask;
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
taskContainers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
        e.preventDefault();

        const bottomTask = insertAbove(container, e.clientY);
        const currentTask = document.querySelector(".is-dragging");

        if (!bottomTask) {
            container.appendChild(currentTask);
        } else {
            container.insertBefore(currentTask, bottomTask);
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

// apply button
applyBtn.addEventListener("click", () => {
    const title = formInputs.title.value.trim();
    const description = formInputs.description.value.trim();
    const date = formInputs.date.value.trim();
    const statusValue = formInputs.status.value.trim();
    const priority = formInputs.priority.value.trim();

    if (!title || !date ) {
        alert("Please fill out all fields before submitting.");
        return; // Stop further execution if validation fails
    }

    const newTask = {
        id: genId(),
        title,
        description,
        date,
        status: statusValue.toLowerCase(),
        priority
    };

    tasks.push(newTask);

    // save to localstorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // create
    createTasks();

    //update
    updateStats();

    // clearinput
    formInputs.title.value = '';
    formInputs.description.value = '';
    formInputs.date.value = '';
    formInputs.status.value = 'todo';
    formInputs.priority.value = 'P3';

    // close display
    addDisplay.classList.add("hidden");
    addDisplay.classList.remove("flex");
});

//update status
const updateTaskStatus = (taskObj, newStatus) => {
    const taskId = taskObj.dataset.id;

    const taskUpdate = tasks.find(task => task.id === taskId);
    if (taskUpdate) {
        //updating status
        taskUpdate.status = newStatus.toLowerCase();
        
        //saving
        localStorage.setItem("tasks", JSON.stringify(tasks));
        
        //update
        updateStats();
    }
};

//update count
const updateStats = () => {
    const swimLanes = {
        todo: document.querySelectorAll(".swim-lane")[0],
        doing: document.querySelectorAll(".swim-lane")[1],
        done: document.querySelectorAll(".swim-lane")[2]
    };

    const counts = {
        todo: swimLanes.todo.querySelectorAll(".task").length,
        doing: swimLanes.doing.querySelectorAll(".task").length,
        done: swimLanes.done.querySelectorAll(".task").length
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

        let pColor;
        if (task.dataset.priority === 'P1') {
            pColor = "bg-red-500";
        } else if (task.dataset.priority === 'P2') {
            pColor = "bg-orange-400";
        } else {
            pColor = "bg-green-500";
        }

        displayContainer.querySelector(".text-2xl.text-greytwo.font-medium").textContent = taskTitle;
        displayContainer.querySelector(".bg-greyone.text-whiteone").textContent = taskDescription;
        displayContainer.querySelector(".left-tag").textContent = taskDate;
        const rightTag = displayContainer.querySelector(".right-tag");
        rightTag.textContent = taskPriority;
        rightTag.className = `right-tag ${pColor}`;

        displayContainer.classList.remove("hidden");
        displayContainer.classList.add("flex");
    });
    closeDisplayBtn.addEventListener("click", () => {
        displayContainer.classList.add("hidden");
        displayContainer.classList.remove("flex");

        displayContainer.querySelector(".text-2xl.text-greytwo.font-medium").textContent = "";
        displayContainer.querySelector(".bg-greyone.text-whiteone").textContent = "";
        displayContainer.querySelector(".left-tag").textContent = "";
        const rightTag = displayContainer.querySelector(".right-tag");
        rightTag.textContent = "";
        rightTag.className = "right-tag"; 
    });
}

// loading tasks from localstorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// loading the tasks when the html file is fully loaded
document.addEventListener("DOMContentLoaded", createTasks);