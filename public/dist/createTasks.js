export const createTasks = (tasks) => {
    const swimLane = {
        todo: document.querySelectorAll(".swim-lane")[0],
        doing: document.querySelectorAll(".swim-lane")[1],
        done: document.querySelectorAll(".swim-lane")[2],
    };
    if (!swimLane.todo || !swimLane.doing || !swimLane.done) {
        console.error("There are no task containers");
        return;
    }
    Object.values(swimLane).forEach((lane) => (lane.innerHTML = ""));
    tasks.forEach((task) => {
        const newTask = document.createElement("div");
        newTask.className = `task card`;
        newTask.draggable = true;
        newTask.dataset.id = String(task.id);
        let bgColor, hoverColor, activeColor, pColor;
        if (task.priority === "P1") {
            bgColor = "bg-cardred";
            hoverColor = "hover:bg-cardredhov";
            activeColor = "active:bg-cardredactive";
            pColor = "red-500";
        }
        else if (task.priority === "P2") {
            bgColor = "bg-cardorange";
            hoverColor = "hover:bg-cardorangehov";
            activeColor = "active:bg-cardorangeactive";
            pColor = "orange-400";
        }
        else {
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
        const taskLane = swimLane[task.status];
        if (taskLane) {
            taskLane.appendChild(newTask);
        }
        else {
            console.error("error");
        }
    });
};
