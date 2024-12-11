export const msg = (message, container) => {
    if (message.length != 0 && container.parentElement) {
        const oldMsg = document.querySelector('.typeMsg');
        if (oldMsg) {
            oldMsg.remove();
        }
        const newMsg = document.createElement('p');
        newMsg.textContent = message;
        newMsg.className = "typeMsg block text-center text-2xl font-bold";
        const child = container.firstChild;
        container.parentElement.appendChild(newMsg);
        setTimeout(() => {
            newMsg.remove();
        }, 2000);
    }
};
