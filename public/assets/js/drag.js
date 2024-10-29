const allTasks = document.querySelectorAll(".task");
const taskContainers = document.querySelectorAll(".swim-lane");

allTasks.forEach((task) => {
    task.addEventListener("dragstart", () => {
        task.classList.add("is-dragging");
    });

    task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging");
    });
});

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
