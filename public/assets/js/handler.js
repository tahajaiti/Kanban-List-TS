const addBtn = document.querySelector("#addBtn");
const addDisplay = document.querySelector("#addDisplay");
const closeBtnAdd = document.querySelector("#closeBtnAdd");
const applyBtn = document.querySelector("#applyBtn");
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

// loading tasks from localstorage
let tasks = JSON.parse(localStorage.getItem("test222")) || [];

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

// create newtask
const createTasks = () => {
    const swimLanes = {
        todo: document.querySelectorAll(".swim-lane")[0],
        doing: document.querySelectorAll(".swim-lane")[1],
        done: document.querySelectorAll(".swim-lane")[2]
    };

    // clear content before any appending
    Object.values(swimLanes).forEach(lane => lane.innerHTML = "");

    // creating the actual task
    tasks.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.className = `task card`;
        taskElement.draggable = true;

        let bgColor, hoverColor, activeColor;
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

        taskElement.classList.add(bgColor, hoverColor, activeColor);

        taskElement.innerHTML = `
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
            taskLane.appendChild(taskElement);
        } else {
            console.error("error");
        }

        // add drag class
        addDragEventListeners(taskElement);
    });
};

// adding the drag
const addDragEventListeners = (element) => {
    element.addEventListener("dragstart", () => {
        element.classList.add("is-dragging");
    });
    element.addEventListener("dragend", () => {
        element.classList.remove("is-dragging");
    });
};

// loading the tasks when loading
document.addEventListener("DOMContentLoaded", createTasks);

// apply button
applyBtn.addEventListener("click", () => {
    const title = formInputs.title.value;
    const description = formInputs.description.value;
    const date = formInputs.date.value;
    const statusValue = formInputs.status.value;
    const priority = formInputs.priority.value;

    const newTask = {
        title,
        description,
        date,
        status: statusValue.toLowerCase(),
        priority
    };

    tasks.push(newTask);

    // save to localstorage
    localStorage.setItem("test222", JSON.stringify(tasks));

    // create
    createTasks();

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
});

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